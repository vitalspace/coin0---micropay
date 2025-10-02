import { ethers } from 'ethers';
import { Aptos, AptosConfig, Network, Account, InputViewFunctionData } from '@aptos-labs/ts-sdk';

// Types for our swap system
interface SwapRequest {
  id: string;
  userAddress: string;
  aptAmount: string;
  targetErc20Address: string;
  status: 'pending' | 'completed' | 'failed';
  aptTxHash?: string;
  erc20TxHash?: string;
  createdAt: Date;
  processedAt?: Date;
}

interface NetworkConfig {
  aptos: {
    nodeUrl: string;
    contractAddress: string;
  };
  ethereum: {
    rpcUrl: string;
    privateKey: string;
    contractAddress: string;
    erc20ContractAddress: string;
  };
}

export class SwapService {
  private aptos: Aptos;
  private ethereumProvider!: ethers.Provider;
  private ethereumWallet!: ethers.Wallet;
  private config: NetworkConfig;
  private processedTransactions: Set<string> = new Set();

  constructor() {
    this.config = {
      aptos: {
        nodeUrl: process.env.APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1',
        contractAddress: process.env.APTOS_CONTRACT_ADDRESS || ''
      },
      ethereum: {
        rpcUrl: process.env.ETHEREUM_RPC_URL || '',
        privateKey: process.env.ETHEREUM_PRIVATE_KEY || '',
        contractAddress: process.env.ETHEREUM_CONTRACT_ADDRESS || '',
        erc20ContractAddress: process.env.ERC20_CONTRACT_ADDRESS || ''
      }
    };

    // Initialize Aptos client with new SDK (TESTNET only)
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    this.aptos = new Aptos(aptosConfig);

    // Initialize Ethereum provider and wallet with validation
    this.initializeEthereumWallet();
  }

  /**
   * Initialize Ethereum wallet with proper error handling
   */
  private initializeEthereumWallet(): void {
    try {
      if (!this.config.ethereum.rpcUrl) {
        throw new Error('ETHEREUM_RPC_URL is required');
      }

      if (!this.config.ethereum.privateKey) {
        throw new Error('ETHEREUM_PRIVATE_KEY is required');
      }

      // Validate private key format (should start with 0x and be 64 characters)
      if (!this.config.ethereum.privateKey.startsWith('0x') || this.config.ethereum.privateKey.length !== 66) {
        throw new Error('ETHEREUM_PRIVATE_KEY must be a valid 64-character hexadecimal string starting with 0x');
      }

      this.ethereumProvider = new ethers.JsonRpcProvider(this.config.ethereum.rpcUrl);
      this.ethereumWallet = new ethers.Wallet(this.config.ethereum.privateKey, this.ethereumProvider);

      console.log('Ethereum wallet initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Ethereum wallet:', error);
      throw error;
    }
  }

  /**
   * Process Aptos transaction by hash (more efficient than continuous monitoring)
   */
  async processAptosTransactionByHash(aptosTxHash: string, expectedUserAddress: string): Promise<any> {
    try {
      console.log(`Processing Aptos transaction: ${aptosTxHash}`);

      // Get transaction details
      const txDetails = await this.aptos.getTransactionByHash({ transactionHash: aptosTxHash });

      // Validate transaction
      const validation = await this.validateTransactionByHash(txDetails, expectedUserAddress);

      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          txHash: aptosTxHash
        };
      }

      // Send ERC20 tokens
      if (!validation.aptAmount) {
        throw new Error('APT amount is required');
      }

      const distributionResult = await this.sendErc20Tokens(
        expectedUserAddress,
        validation.aptAmount
      );

      return {
        success: true,
        aptosTxHash,
        erc20TxHash: distributionResult.txHash,
        aptAmount: validation.aptAmount,
        erc20Amount: distributionResult.erc20Amount
      };

    } catch (error) {
      console.error('Error processing transaction by hash:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: aptosTxHash
      };
    }
  }

  /**
   * Check for new swap transactions on Aptos
   */
  private async checkForNewSwapTransactions(): Promise<void> {
    try {
      // Get recent transactions for our contract address
      const transactions = await this.aptos.getAccountTransactions({
        accountAddress: this.config.aptos.contractAddress,
        options: { limit: 10 }
      });

      for (const tx of transactions) {
        if (this.processedTransactions.has(tx.hash)) {
          continue; // Already processed
        }

        await this.processAptosTransaction(tx);
        this.processedTransactions.add(tx.hash);
      }
    } catch (error) {
      console.error('Error checking Aptos transactions:', error);
    }
  }

  /**
   * Process a single Aptos transaction
   */
  private async processAptosTransaction(tx: any): Promise<void> {
    try {
      // Check if this is a swap transaction
      if (tx.type !== 'user_transaction') return;

      const payload = tx.payload;
      if (!payload || payload.function !== 'swap_apt_to_erc20') return;

      // Extract transaction details
      const txDetails = await this.aptos.getTransactionByHash({ transactionHash: tx.hash });
      const aptAmount = this.extractAptAmountFromEvents(txDetails);
      const senderAddress = this.extractSenderAddress(tx);

      if (!aptAmount || !senderAddress) return;

      console.log(`Processing swap: ${aptAmount} APT from ${senderAddress}`);

      // Validate the transaction
      const isValid = await this.validateAptosTransaction(tx.hash, aptAmount, senderAddress);

      if (isValid) {
        // Send ERC20 tokens
        await this.sendErc20Tokens(senderAddress, aptAmount);
      }
    } catch (error) {
      console.error('Error processing Aptos transaction:', error);
    }
  }

  /**
   * Validate Aptos transaction
   */
  private async validateAptosTransaction(
    txHash: string,
    aptAmount: string,
    senderAddress: string
  ): Promise<boolean> {
    try {
      // Get transaction details
      const tx = await this.aptos.getTransactionByHash({ transactionHash: txHash });

      // Verify the transaction was successful
      if ((tx as any).success !== true) {
        console.log(`Transaction ${txHash} failed on Aptos`);
        return false;
      }

      // Verify the amount matches expected
      const actualAmount = this.extractAptAmountFromTransaction(tx);
      if (actualAmount !== aptAmount) {
        console.log(`Amount mismatch in transaction ${txHash}`);
        return false;
      }

      // Additional validation logic can be added here
      console.log(`Transaction ${txHash} validated successfully`);
      return true;
    } catch (error) {
      console.error('Error validating transaction:', error);
      return false;
    }
  }

  /**
   * Validate transaction by hash
   */
  private async validateTransactionByHash(txDetails: any, expectedUserAddress: string): Promise<{isValid: boolean, aptAmount?: string, error?: string}> {
    try {
      // Check if transaction was successful
      if ((txDetails as any).success !== true) {
        return { isValid: false, error: 'Transaction failed on Aptos' };
      }

      // Extract sender address
      const senderAddress = txDetails.sender;
      if (senderAddress !== expectedUserAddress) {
        return { isValid: false, error: 'Sender address does not match expected user' };
      }

      // Extract APT amount from transaction
      const aptAmount = this.extractAptAmountFromTransaction(txDetails);
      if (!aptAmount) {
        return { isValid: false, error: 'Could not extract APT amount from transaction' };
      }

      return { isValid: true, aptAmount };
    } catch (error) {
      return { isValid: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send ERC20 tokens on Ethereum
   */
  private async sendErc20Tokens(recipientAddress: string, aptAmount: string): Promise<{txHash: string, erc20Amount: string}> {
    // Calculate ERC20 amount (1:1 ratio for simplicity)
    const erc20Amount = ethers.parseEther(aptAmount);

    // Create ERC20 contract instance
    const erc20Contract = new ethers.Contract(
      this.config.ethereum.erc20ContractAddress,
      [
        'function transfer(address to, uint256 amount) returns (bool)',
        'function balanceOf(address account) view returns (uint256)'
      ],
      this.ethereumWallet
    );

    // Check balance before transfer
    const balance = await erc20Contract.balanceOf(this.ethereumWallet.address);
    if (balance < erc20Amount) {
      throw new Error('Insufficient ERC20 balance');
    }

    // Send ERC20 tokens
    const tx = await erc20Contract.transfer(recipientAddress, erc20Amount);
    await tx.wait();

    console.log(`Sent ${erc20Amount} ERC20 tokens to ${recipientAddress}. Tx: ${tx.hash}`);

    return {
      txHash: tx.hash,
      erc20Amount: ethers.formatEther(erc20Amount)
    };
  }

  /**
   * Extract APT amount from transaction events
   */
  private extractAptAmountFromEvents(tx: any): string | null {
    // This would need to be implemented based on your specific contract events
    // For now, returning a placeholder
    return '1.0';
  }

  /**
   * Extract sender address from transaction
   */
  private extractSenderAddress(tx: any): string | null {
    if (tx.type === 'user_transaction') {
      return tx.sender;
    }
    return null;
  }

  /**
   * Extract APT amount from transaction
   */
  private extractAptAmountFromTransaction(tx: any): string | null {
    // This would need to be implemented based on your specific contract
    // For now, returning a placeholder
    return '1.0';
  }

  /**
   * Record swap in database (placeholder)
   */
  private async recordSwap(swap: SwapRequest): Promise<void> {
    // Here you would save to your database
    console.log('Recording swap:', swap);
  }

  /**
   * Get swap status by ID
   */
  async getSwapStatus(swapId: string): Promise<SwapRequest | null> {
    // Here you would query your database
    return null;
  }
}
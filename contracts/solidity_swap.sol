// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Simple Token Swap Contract
 * @dev Allows swapping between APT token and other ERC20 tokens
 */
contract TokenSwap is ReentrancyGuard {
    IERC20 public aptToken;
    IERC20 public erc20Token;

    // Exchange rate: APT per ERC20 token (with 18 decimals)
    uint256 public exchangeRate;

    // Events
    event Swapped(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    constructor(
        address _aptToken,
        address _erc20Token,
        uint256 _exchangeRate
    ) {
        aptToken = IERC20(_aptToken);
        erc20Token = IERC20(_erc20Token);
        exchangeRate = _exchangeRate; // APT tokens per ERC20 token
    }

    /**
     * @dev Swap APT tokens for ERC20 tokens
     * @param aptAmount Amount of APT tokens to swap
     * @param minErc20Out Minimum ERC20 tokens to receive (slippage protection)
     */
    function swapAptToErc20(
        uint256 aptAmount,
        uint256 minErc20Out
    ) external nonReentrant {
        require(aptAmount > 0, "Amount must be greater than 0");

        // Calculate output amount
        uint256 erc20Amount = (aptAmount * exchangeRate) / 1e18;

        require(erc20Amount >= minErc20Out, "Insufficient output amount");
        require(erc20Token.balanceOf(address(this)) >= erc20Amount, "Insufficient liquidity");

        // Transfer APT from user to contract
        require(aptToken.transferFrom(msg.sender, address(this), aptAmount), "APT transfer failed");

        // Transfer ERC20 to user
        require(erc20Token.transfer(msg.sender, erc20Amount), "ERC20 transfer failed");

        emit Swapped(msg.sender, address(aptToken), address(erc20Token), aptAmount, erc20Amount);
    }

    /**
     * @dev Swap ERC20 tokens for APT tokens
     * @param erc20Amount Amount of ERC20 tokens to swap
     * @param minAptOut Minimum APT tokens to receive (slippage protection)
     */
    function swapErc20ToApt(
        uint256 erc20Amount,
        uint256 minAptOut
    ) external nonReentrant {
        require(erc20Amount > 0, "Amount must be greater than 0");

        // Calculate output amount
        uint256 aptAmount = (erc20Amount * 1e18) / exchangeRate;

        require(aptAmount >= minAptOut, "Insufficient output amount");
        require(aptToken.balanceOf(address(this)) >= aptAmount, "Insufficient liquidity");

        // Transfer ERC20 from user to contract
        require(erc20Token.transferFrom(msg.sender, address(this), erc20Amount), "ERC20 transfer failed");

        // Transfer APT to user
        require(aptToken.transfer(msg.sender, aptAmount), "APT transfer failed");

        emit Swapped(msg.sender, address(erc20Token), address(aptToken), erc20Amount, aptAmount);
    }

    /**
     * @dev Add liquidity to the contract
     * @param aptAmount Amount of APT tokens to add
     * @param erc20Amount Amount of ERC20 tokens to add
     */
    function addLiquidity(uint256 aptAmount, uint256 erc20Amount) external {
        require(aptAmount > 0 && erc20Amount > 0, "Amounts must be greater than 0");

        require(aptToken.transferFrom(msg.sender, address(this), aptAmount), "APT transfer failed");
        require(erc20Token.transferFrom(msg.sender, address(this), erc20Amount), "ERC20 transfer failed");

        // Update exchange rate based on new ratio
        exchangeRate = (aptToken.balanceOf(address(this)) * 1e18) / erc20Token.balanceOf(address(this));
    }

    /**
     * @dev Get current balances
     */
    function getBalances() external view returns (uint256 aptBalance, uint256 erc20Balance) {
        return (aptToken.balanceOf(address(this)), erc20Token.balanceOf(address(this)));
    }
}
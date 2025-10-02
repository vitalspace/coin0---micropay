import { Elysia } from "elysia";
import { SwapService } from "../services/swap.service";

let swapService: SwapService;

try {
  swapService = new SwapService();
} catch (error) {
  console.error('Failed to initialize swap service:', error);
  swapService = {} as SwapService; // Fallback for TypeScript
}

export const swapRoutes = new Elysia()
  .get("/swap/status/:id", async ({ params }) => {
    const { id } = params;

    if (!swapService.getSwapStatus) {
      return { error: "Swap service not initialized. Check ETHEREUM_PRIVATE_KEY and other environment variables.", status: 500 };
    }

    const swap = await swapService.getSwapStatus(id);

    if (!swap) {
      return { error: "Swap not found", status: 404 };
    }

    return { swap };
  })
  .post("/swap/process-transaction", async ({ body }) => {
    try {
      const { aptosTxHash, userAddress } = body as { aptosTxHash: string; userAddress: string };

      if (!aptosTxHash || !userAddress) {
        return { error: "aptosTxHash and userAddress are required", status: 400 };
      }

      if (!swapService.processAptosTransactionByHash) {
        return { error: "Swap service not initialized. Check ETHEREUM_PRIVATE_KEY and other environment variables.", status: 500 };
      }

      const result = await swapService.processAptosTransactionByHash(aptosTxHash, userAddress);
      return { message: "Transaction processed successfully", result };
    } catch (error) {
      return { error: "Failed to process transaction", details: error, status: 500 };
    }
  })
  .get("/swap/health", () => {
    // Check if service has required properties (indicating successful initialization)
    const isHealthy = !!(swapService as any).ethereumWallet && !!(swapService as any).aptos;

    return {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      service: "aptos-ethereum-swap",
      initialized: isHealthy
    };
  });
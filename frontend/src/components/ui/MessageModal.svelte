<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { useWallet } from "@/hooks/useWallet";
  import { createMessage } from "@/services/api.services";
  import { showToast } from "@/stores/toastStore";
  import { X, Send, MessageCircle } from "lucide-svelte";

  const dispatch = createEventDispatcher();
  const { address } = useWallet();

  export let isOpen = false;
  export let receiverAddress = "";
  export let campaignId: number | undefined = undefined;
  export let campaignTitle = "";

  let message = "";
  let sending = false;

  async function sendMessage() {
    if (!message.trim() || !address || !$address) return;

    try {
      sending = true;
      const subject = campaignId ? `Campaign ID: ${campaignId}` : undefined;
      await createMessage({
        sender_address: $address,
        receiver_address: receiverAddress,
        campaign_id: campaignId,
        message: message.trim(),
        subject,
      });

      message = "";
      isOpen = false;
      showToast("Message sent successfully!", "success");
      dispatch("messageSent");
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("Failed to send message", "error");
    } finally {
      sending = false;
    }
  }

  function closeModal() {
    isOpen = false;
    message = "";
  }

  $: if (!isOpen) {
    message = "";
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
            <MessageCircle class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">Send Message</h3>
            <p class="text-sm text-gray-500">
              To: {receiverAddress.slice(0, 6)}...{receiverAddress.slice(-4)}
            </p>
          </div>
        </div>
        <button
          on:click={closeModal}
          class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Campaign Context -->
      {#if campaignTitle}
        <div class="px-6 py-3 bg-purple-50 border-b border-purple-100">
          <p class="text-sm text-purple-700">
            <span class="font-medium">Regarding:</span> {campaignTitle}
          </p>
        </div>
      {/if}

      <!-- Message Input -->
      <div class="p-6">
        <textarea
          bind:value={message}
          placeholder="Type your message here..."
          class="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm resize-none"
          maxlength="1000"
          disabled={sending}
        ></textarea>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs text-gray-500">{message.length}/1000</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
        <button
          on:click={closeModal}
          class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          disabled={sending}
        >
          Cancel
        </button>
        <button
          on:click={sendMessage}
          disabled={!message.trim() || sending}
          class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg"
        >
          {#if sending}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sending...</span>
          {:else}
            <Send class="w-4 h-4" />
            <span>Send Message</span>
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
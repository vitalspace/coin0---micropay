<script lang="ts">
  import { onMount } from "svelte";
  import { useWallet } from "@/hooks/useWallet";
  import { getUserMessages, getConversation, createMessage } from "@/services/api.services";
  import type { Message } from "@/types/types";
  import { showToast } from "@/stores/toastStore";
  import { MessageCircle, Send, User } from "lucide-svelte";

  const { address } = useWallet();

  let messages: Message[] = [];
  let conversations: { [key: string]: { messages: Message[], campaignId?: number, otherAddress: string } } = {};
  let loading = true;
  let selectedConversation: string | null = null;
  let conversationMessages: Message[] = [];
  let conversationLoading = false;
  let newMessage = "";
  let sending = false;
  let lastLoadedAddress = "";

  async function loadMessages() {
    if (!$address || $address === lastLoadedAddress) {
      return;
    }

    try {
      loading = true;
      lastLoadedAddress = $address;
      const response = await getUserMessages($address);
      messages = response.messages || [];

      // Group messages by conversation (otherUser + campaign_id)
      conversations = {};
      messages.forEach((msg) => {
        const otherUser = msg.sender_address === $address ? msg.receiver_address : msg.sender_address;
        const conversationKey = `${otherUser}_${msg.campaign_id || 'general'}`;
        if (!conversations[conversationKey]) {
          conversations[conversationKey] = {
            messages: [],
            campaignId: msg.campaign_id,
            otherAddress: otherUser
          };
        }
        conversations[conversationKey].messages.push(msg);
      });
    } catch (error) {
      console.error("Error loading messages:", error);
      console.error("Error details:", error);
      showToast("Failed to load messages", "error");
    } finally {
      loading = false;
    }
  }

  async function selectConversation(conversationKey: string) {
    selectedConversation = conversationKey;
    const conv = conversations[conversationKey];
    if (!conv) return;

    try {
      conversationLoading = true;
      const response = await getConversation($address!, conv.otherAddress, {
        campaign_id: conv.campaignId
      });
      conversationMessages = response.messages || [];
    } catch (error) {
      console.error("Error loading conversation:", error);
      showToast("Failed to load conversation", "error");
    } finally {
      conversationLoading = false;
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation || !$address) return;

    const conv = conversations[selectedConversation];
    if (!conv) return;

    try {
      sending = true;
      await createMessage({
        sender_address: $address,
        receiver_address: conv.otherAddress,
        campaign_id: conv.campaignId,
        message: newMessage.trim(),
      });

      newMessage = "";
      // Reload conversation
      await selectConversation(selectedConversation);
      // Reload messages list
      await loadMessages();
      showToast("Message sent!", "success");
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("Failed to send message", "error");
    } finally {
      sending = false;
    }
  }

  onMount(() => {
    if ($address) {
      loadMessages();
    }
  });

  $: if ($address && $address !== lastLoadedAddress) {
    loadMessages();
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
  <!-- Conversations List -->
  <div class="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-lg">
    <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <MessageCircle class="w-5 h-5" />
      Conversations
    </h2>

    {#if loading}
      <div class="flex items-center justify-center py-8">
        <div class="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    {:else if Object.keys(conversations).length === 0}
      <div class="text-center py-8 text-gray-500">
        <MessageCircle class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No conversations yet</p>
      </div>
    {:else}
      <div class="space-y-2">
        {#each Object.entries(conversations) as [conversationKey, conv]}
          <button
            on:click={() => selectConversation(conversationKey)}
            class="w-full p-3 rounded-xl text-left transition-all duration-200 hover:bg-purple-50 border {selectedConversation === conversationKey ? 'bg-purple-100 border-purple-200' : 'border-transparent'}"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-900 truncate">
                  {conv.otherAddress.slice(0, 6)}...{conv.otherAddress.slice(-4)}
                </div>
                <div class="text-sm text-gray-500 truncate">
                  {#if conv.campaignId}
                    Campaign {conv.campaignId}: {conv.messages[conv.messages.length - 1]?.message || "No messages"}
                  {:else}
                    {conv.messages[conv.messages.length - 1]?.message || "No messages"}
                  {/if}
                </div>
              </div>
              {#if conv.messages.some(m => !m.isRead && m.receiver_address === $address)}
                <div class="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Conversation View -->
  <div class="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-lg flex flex-col">
    {#if !selectedConversation}
      <div class="flex-1 flex items-center justify-center text-gray-500">
        <div class="text-center">
          <MessageCircle class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    {:else}
      <!-- Conversation Header -->
      {#if selectedConversation}
        {@const conv = conversations[selectedConversation]}
        <div class="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
            <User class="w-5 h-5 text-white" />
          </div>
          <div>
            <div class="font-medium text-gray-900">
              {conv.otherAddress.slice(0, 6)}...{conv.otherAddress.slice(-4)}
            </div>
            <div class="text-sm text-gray-500">
              {#if conv.campaignId}
                Campaign {conv.campaignId}
              {:else}
                Conversation
              {/if}
            </div>
          </div>
        </div>
      {/if}

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto mb-4 space-y-4">
        {#if conversationLoading}
          <div class="flex items-center justify-center py-8">
            <div class="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        {:else}
          {#each conversationMessages as message}
            <div class="flex {message.sender_address === $address ? 'justify-end' : 'justify-start'}">
              <div class="max-w-[70%] {message.sender_address === $address ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-2">
                {#if message.subject}
                  <p class="text-xs font-medium opacity-80 mb-1">{message.subject}</p>
                {/if}
                <p class="text-sm">{message.message}</p>
                <p class="text-xs opacity-70 mt-1">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <!-- Message Input -->
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={newMessage}
          placeholder="Type your message..."
          class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm"
          on:keydown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={sending}
        />
        <button
          on:click={sendMessage}
          disabled={!newMessage.trim() || sending}
          class="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed shadow-lg"
        >
          {#if sending}
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {:else}
            <Send class="w-5 h-5" />
          {/if}
        </button>
      </div>
    {/if}
  </div>
</div>
<script lang="ts">
  import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-svelte';
  import { removeToast } from '../../stores/toastStore';
  import type { Toast } from '../../stores/toastStore';

  interface Props {
    toast: Toast;
  }

  let { toast }: Props = $props();

  const IconComponent = $derived(() => {
    switch (toast.type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'warn':
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  });

  function getBgColor() {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warn':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }

  function getTextColor() {
    return 'text-white';
  }
</script>

<div class="flex items-center p-4 mb-2 rounded-lg shadow-lg {getBgColor()} {getTextColor()} max-w-sm">
  <IconComponent class="w-6 h-6 mr-3" />

  
  <span class="flex-1">{toast.message}</span>
  <button
    onclick={() => removeToast(toast.id)}
    class="ml-3 p-1 rounded hover:bg-opacity-20 hover:bg-black"
  >
    <X class="w-4 h-4" />
  </button>
</div>
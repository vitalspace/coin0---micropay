module swap_contract::aptos_token_swap {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::account;
    use aptos_std::from_bcs;

    /// Event structure for swap completion
    struct SwapCompleted has drop, store {
        user_address: address,
        apt_amount: u64,
        erc20_amount: u64,
        swap_id: u64,
        timestamp: u64
    }

    /// Resource to hold the swap event handle and counter
    struct SwapEvents has key {
        swap_events: event::EventHandle<SwapCompleted>,
        swap_counter: u64,
    }

    /// Initialize the contract (call this once when deploying)
    public entry fun initialize(account: &signer) {
        let swap_events = SwapEvents {
            swap_events: account::new_event_handle<SwapCompleted>(account),
            swap_counter: 0,
        };
        move_to(account, swap_events);
    }

    /// Simple swap function between APT and ERC20 tokens
    public entry fun swap_apt_to_erc20<TokenType>(
        sender: &signer,
        apt_amount: u64,
        min_erc20_out: u64
    ) {
        let sender_addr = signer::address_of(sender);

        // Transfer APT from sender to contract
        let apt_coins = coin::withdraw<AptosCoin>(sender, apt_amount);

        // Simple 1:1 swap ratio for demonstration
        // In production, this would use an oracle or AMM formula
        let erc20_amount = apt_amount;

        // Check minimum output requirement
        assert!(erc20_amount >= min_erc20_out, 0x1);

        // Deposit ERC20 tokens to sender
        coin::deposit(signer::address_of(sender), erc20_amount);

        // Emit swap completion event
        let swap_events = borrow_global_mut<SwapEvents>(@swap_contract);
        let current_swap_id = swap_events.swap_counter;

        event::emit_event(&mut swap_events.swap_events, SwapCompleted {
            user_address: sender_addr,
            apt_amount,
            erc20_amount,
            swap_id: current_swap_id,
            timestamp: aptos_framework::timestamp::now_microseconds()
        });

        // Increment counter for next swap
        swap_events.swap_counter = current_swap_id + 1;
    }

    /// Get swap information by swap ID
    #[view]
    public fun get_swap_info(swap_id: u64): (address, u64, u64, u64) acquires SwapEvents {
        let swap_events = borrow_global<SwapEvents>(@swap_contract);

        // Get specific event by index (this is a simplified approach)
        // In production, you'd want to query events by user address
        let counter = 0;
        loop {
            if (counter >= swap_id) break;
            counter = counter + 1;
        };

        // Return default values for now
        // In a real implementation, you'd store and query swap data
        ( @0x0, 0, 0, 0 )
    }

    /// Simple swap function from ERC20 to APT
    public entry fun swap_erc20_to_apt<TokenType>(
        sender: &signer,
        erc20_amount: u64,
        min_apt_out: u64
    ) {
        // Transfer ERC20 from sender to contract
        let erc20_coins = coin::withdraw<TokenType>(sender, erc20_amount);

        // Simple 1:1 swap ratio for demonstration
        let apt_amount = erc20_amount;

        // Check minimum output requirement
        assert!(apt_amount >= min_apt_out, 0x1);

        // Deposit APT to sender
        coin::deposit(signer::address_of(sender), apt_amount);
    }
}
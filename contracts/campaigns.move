module campaign_contract::campaigns {
    use std::signer;
    use std::string::{String, utf8};
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::table::{Self, Table};

    /// Campaign types enum
    const DONATION: u8 = 0;
    const BUSINESS: u8 = 1;
    const PRODUCT: u8 = 2;

    /// Donation structure
    struct Donation has store, copy, drop {
        donor: address,
        campaign_id: u64,
        amount: u64,
        donated_at: u64,
    }

    /// Purchase structure
    struct Purchase has store, copy, drop {
        buyer: address,
        campaign_id: u64,
        quantity: u64,
        total_amount: u64,
        purchased_at: u64,
    }

    /// Event structure for donations
    struct DonationMade has drop, store {
        donor: address,
        campaign_id: u64,
        amount: u64,
        donated_at: u64,
    }

    /// Event structure for purchases
    struct PurchaseMade has drop, store {
        buyer: address,
        campaign_id: u64,
        quantity: u64,
        total_amount: u64,
        purchased_at: u64,
    }

    /// Event structure for fund withdrawals
    struct FundsWithdrawn has drop, store {
        campaign_id: u64,
        withdrawn_by: address,
        amount: u64,
        withdrawn_at: u64,
    }

    /// Campaign structure
    struct Campaign has store, copy, drop {
        id: u64,
        campaign_type: u8,
        name: String,
        description: String,
        goal: u64, // Para campañas de donación
        price: u64, // Para campañas de producto
        image: String,
        is_active: bool,
        created_by: address,
        created_at: u64,
        updated_at: u64,
    }

    /// Event structure for campaign creation
    struct CampaignCreated has drop, store {
        campaign_id: u64,
        campaign_type: u8,
        name: String,
        created_by: address,
        created_at: u64,
    }

    /// Event structure for campaign updates
    struct CampaignUpdated has drop, store {
        campaign_id: u64,
        updated_by: address,
        updated_at: u64,
    }

    /// Resource to hold campaigns and events
    struct CampaignStore has key {
        campaigns: Table<u64, Campaign>,
        campaign_balances: Table<u64, u64>, // Balance de APT para cada campaña
        donations: Table<u64, vector<Donation>>, // Historial de donaciones por campaña
        purchases: Table<u64, vector<Purchase>>, // Historial de compras por campaña
        campaign_events: event::EventHandle<CampaignCreated>,
        update_events: event::EventHandle<CampaignUpdated>,
        donation_events: event::EventHandle<DonationMade>,
        purchase_events: event::EventHandle<PurchaseMade>,
        withdrawal_events: event::EventHandle<FundsWithdrawn>,
        next_campaign_id: u64,
    }

    /// Initialize the campaign contract
    public entry fun initialize(account: &signer) {
        let campaign_store = CampaignStore {
            campaigns: table::new(),
            campaign_balances: table::new(),
            donations: table::new(),
            purchases: table::new(),
            campaign_events: account::new_event_handle<CampaignCreated>(account),
            update_events: account::new_event_handle<CampaignUpdated>(account),
            donation_events: account::new_event_handle<DonationMade>(account),
            purchase_events: account::new_event_handle<PurchaseMade>(account),
            withdrawal_events: account::new_event_handle<FundsWithdrawn>(account),
            next_campaign_id: 1,
        };
        move_to(account, campaign_store);
    }

    /// Create a new donation campaign
    public entry fun create_donation_campaign(
        creator: &signer,
        name: String,
        description: String,
        goal: u64,
        image: String
    ) acquires CampaignStore {
        create_campaign(creator, DONATION, name, description, goal, 0, image);
    }

    /// Create a new business campaign
    public entry fun create_business_campaign(
        creator: &signer,
        name: String,
        description: String,
        image: String
    ) acquires CampaignStore {
        create_campaign(creator, BUSINESS, name, description, 0, 0, image);
    }

    /// Create a new product campaign
    public entry fun create_product_campaign(
        creator: &signer,
        name: String,
        description: String,
        price: u64,
        image: String
    ) acquires CampaignStore {
        create_campaign(creator, PRODUCT, name, description, 0, price, image);
    }

    /// Internal function to create campaigns
    fun create_campaign(
        creator: &signer,
        campaign_type: u8,
        name: String,
        description: String,
        goal: u64,
        price: u64,
        image: String
    ) acquires CampaignStore {
        let creator_addr = signer::address_of(creator);
        let campaign_store = borrow_global_mut<CampaignStore>(@campaign_contract);

        let campaign_id = campaign_store.next_campaign_id;
        let current_time = aptos_framework::timestamp::now_microseconds();

        let new_campaign = Campaign {
            id: campaign_id,
            campaign_type,
            name,
            description,
            goal,
            price,
            image,
            is_active: true,
            created_by: creator_addr,
            created_at: current_time,
            updated_at: current_time,
        };

        table::add(&mut campaign_store.campaigns, campaign_id, new_campaign);

        // Emit creation event
        event::emit_event(&mut campaign_store.campaign_events, CampaignCreated {
            campaign_id,
            campaign_type,
            name,
            created_by: creator_addr,
            created_at: current_time,
        });

        // Increment counter
        campaign_store.next_campaign_id = campaign_id + 1;
    }

    /// Update campaign active status
    public entry fun update_campaign_status(
        updater: &signer,
        campaign_id: u64,
        is_active: bool
    ) acquires CampaignStore {
        let updater_addr = signer::address_of(updater);
        let campaign_store = borrow_global_mut<CampaignStore>(@campaign_contract);

        assert!(table::contains(&campaign_store.campaigns, campaign_id), 0x1);

        let campaign = table::borrow_mut(&mut campaign_store.campaigns, campaign_id);
        campaign.is_active = is_active;
        campaign.updated_at = aptos_framework::timestamp::now_microseconds();

        // Emit update event
        event::emit_event(&mut campaign_store.update_events, CampaignUpdated {
            campaign_id,
            updated_by: updater_addr,
            updated_at: campaign.updated_at,
        });
    }

    /// Get campaign by ID
    #[view]
    public fun get_campaign(campaign_id: u64): (u64, u8, String, String, u64, u64, String, bool, address, u64, u64) acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(@campaign_contract);
        assert!(table::contains(&campaign_store.campaigns, campaign_id), 0x1);

        let campaign = table::borrow(&campaign_store.campaigns, campaign_id);
        (
            campaign.id,
            campaign.campaign_type,
            campaign.name,
            campaign.description,
            campaign.goal,
            campaign.price,
            campaign.image,
            campaign.is_active,
            campaign.created_by,
            campaign.created_at,
            campaign.updated_at,
        )
    }

    /// Get campaigns by creator
    #[view]
    public fun get_campaigns_by_creator(creator: address): vector<u64> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(@campaign_contract);
        let campaign_ids = vector::empty<u64>();

        let campaign_id = 1;
        while (campaign_id < campaign_store.next_campaign_id) {
            if (table::contains(&campaign_store.campaigns, campaign_id)) {
                let campaign = table::borrow(&campaign_store.campaigns, campaign_id);
                if (campaign.created_by == creator) {
                    vector::push_back(&mut campaign_ids, campaign_id);
                };
            };
            campaign_id = campaign_id + 1;
        };

        campaign_ids
    }

    /// Get all active campaigns
    #[view]
    public fun get_active_campaigns(): vector<u64> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(@campaign_contract);
        let active_campaigns = vector::empty<u64>();

        let campaign_id = 1;
        while (campaign_id < campaign_store.next_campaign_id) {
            if (table::contains(&campaign_store.campaigns, campaign_id)) {
                let campaign = table::borrow(&campaign_store.campaigns, campaign_id);
                if (campaign.is_active) {
                    vector::push_back(&mut active_campaigns, campaign_id);
                };
            };
            campaign_id = campaign_id + 1;
        };

        active_campaigns
    }

    /// Get total number of campaigns
    #[view]
    public fun get_total_campaigns(): u64 acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(@campaign_contract);
        campaign_store.next_campaign_id - 1
    }

    /// Check if campaign exists
    #[view]
    public fun campaign_exists(campaign_id: u64): bool acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(@campaign_contract);
        table::contains(&campaign_store.campaigns, campaign_id)
    }

    /// Donate to a donation campaign
    public entry fun donate_to_campaign(
        donor: &signer,
        campaign_id: u64,
        amount: u64
    ) acquires CampaignStore {
        let donor_addr = signer::address_of(donor);
        let campaign_store = borrow_global_mut<CampaignStore>(@campaign_contract);

        // Verificar que la campaña existe y está activa
        assert!(table::contains(&campaign_store.campaigns, campaign_id), 0x1);
        let campaign = table::borrow(&campaign_store.campaigns, campaign_id);
        assert!(campaign.is_active, 0x2);
        assert!(campaign.campaign_type == DONATION, 0x3); // Solo para campañas de donación
        assert!(amount > 0, 0x4);

        // Transferir APT del donador al contrato
        coin::transfer<AptosCoin>(donor, @campaign_contract, amount);

        // Actualizar balance de la campaña
        let current_balance = if (table::contains(&campaign_store.campaign_balances, campaign_id)) {
            *table::borrow(&campaign_store.campaign_balances, campaign_id)
        } else {
            0
        };
        table::upsert(&mut campaign_store.campaign_balances, campaign_id, current_balance + amount);

        // Registrar la donación
        let current_time = aptos_framework::timestamp::now_microseconds();
        let donation = Donation {
            donor: donor_addr,
            campaign_id,
            amount,
            donated_at: current_time,
        };

        if (!table::contains(&campaign_store.donations, campaign_id)) {
            table::add(&mut campaign_store.donations, campaign_id, vector::empty());
        };

        let donations = table::borrow_mut(&mut campaign_store.donations, campaign_id);
        vector::push_back(donations, donation);

        // Emitir evento de donación
        event::emit_event(&mut campaign_store.donation_events, DonationMade {
            donor: donor_addr,
            campaign_id,
            amount,
            donated_at: current_time,
        });
    }

    /// Purchase from a product campaign
    public entry fun purchase_product(
        buyer: &signer,
        campaign_id: u64,
        quantity: u64
    ) acquires CampaignStore {
        let buyer_addr = signer::address_of(buyer);
        let campaign_store = borrow_global_mut<CampaignStore>(@campaign_contract);

        // Verificar que la campaña existe y está activa
        assert!(table::contains(&campaign_store.campaigns, campaign_id), 0x1);
        let campaign = table::borrow(&campaign_store.campaigns, campaign_id);
        assert!(campaign.is_active, 0x2);
        assert!(campaign.campaign_type == PRODUCT, 0x3); // Solo para campañas de producto
        assert!(quantity > 0, 0x4);
        assert!(campaign.price > 0, 0x5);

        let total_amount = campaign.price * quantity;

        // Transferir APT del comprador al contrato
        coin::transfer<AptosCoin>(buyer, @campaign_contract, total_amount);

        // Actualizar balance de la campaña
        let current_balance = if (table::contains(&campaign_store.campaign_balances, campaign_id)) {
            *table::borrow(&campaign_store.campaign_balances, campaign_id)
        } else {
            0
        };
        table::upsert(&mut campaign_store.campaign_balances, campaign_id, current_balance + total_amount);

        // Registrar la compra
        let current_time = aptos_framework::timestamp::now_microseconds();
        let purchase = Purchase {
            buyer: buyer_addr,
            campaign_id,
            quantity,
            total_amount,
            purchased_at: current_time,
        };

        if (!table::contains(&campaign_store.purchases, campaign_id)) {
            table::add(&mut campaign_store.purchases, campaign_id, vector::empty());
        };

        let purchases = table::borrow_mut(&mut campaign_store.purchases, campaign_id);
        vector::push_back(purchases, purchase);

        // Emitir evento de compra
        event::emit_event(&mut campaign_store.purchase_events, PurchaseMade {
            buyer: buyer_addr,
            campaign_id,
            quantity,
            total_amount,
            purchased_at: current_time,
        });
    }

    /// Withdraw funds from campaign (only by campaign creator)
    public entry fun withdraw_funds(
        campaign_creator: &signer,
        campaign_id: u64,
        amount: u64
    ) acquires CampaignStore {
        let creator_addr = signer::address_of(campaign_creator);
        let campaign_store = borrow_global_mut<CampaignStore>(@campaign_contract);

        // Verificar que la campaña existe
        assert!(table::contains(&campaign_store.campaigns, campaign_id), 0x1);
        let campaign = table::borrow(&campaign_store.campaigns, campaign_id);

        // Solo el creador puede retirar fondos
        assert!(campaign.created_by == creator_addr, 0x6);
        assert!(amount > 0, 0x4);

        // Verificar que hay suficiente balance
        assert!(table::contains(&campaign_store.campaign_balances, campaign_id), 0x7);
        let current_balance = *table::borrow(&campaign_store.campaign_balances, campaign_id);
        assert!(current_balance >= amount, 0x8);

        // Transferir APT del contrato al creador
        coin::transfer<AptosCoin>(campaign_creator, creator_addr, amount);

        // Actualizar balance
        table::upsert(&mut campaign_store.campaign_balances, campaign_id, current_balance - amount);

        // Emitir evento de retiro
        let current_time = aptos_framework::timestamp::now_microseconds();
        event::emit_event(&mut campaign_store.withdrawal_events, FundsWithdrawn {
            campaign_id,
            withdrawn_by: creator_addr,
            amount,
            withdrawn_at: current_time,
        });
    }

    /// Get campaign balance
    #[view]
    public fun get_campaign_balance(campaign_id: u64): u64 acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(@campaign_contract);
        if (table::contains(&campaign_store.campaign_balances, campaign_id)) {
            *table::borrow(&campaign_store.campaign_balances, campaign_id)
        } else {
            0
        }
    }

    /// Get campaign progress (for donation campaigns)
    #[view]
    public fun get_campaign_progress(campaign_id: u64): (u64, u64) acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(@campaign_contract);
        assert!(table::contains(&campaign_store.campaigns, campaign_id), 0x1);

        let campaign = table::borrow(&campaign_store.campaigns, campaign_id);
        assert!(campaign.campaign_type == DONATION, 0x3);

        let current_balance = get_campaign_balance(campaign_id);
        (current_balance, campaign.goal)
    }

    /// Get donation history for a campaign
    #[view]
    public fun get_donation_history(campaign_id: u64): vector<Donation> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(@campaign_contract);
        if (table::contains(&campaign_store.donations, campaign_id)) {
            *table::borrow(&campaign_store.donations, campaign_id)
        } else {
            vector::empty()
        }
    }

    /// Get purchase history for a campaign
    #[view]
    public fun get_purchase_history(campaign_id: u64): vector<Purchase> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(@campaign_contract);
        if (table::contains(&campaign_store.purchases, campaign_id)) {
            *table::borrow(&campaign_store.purchases, campaign_id)
        } else {
            vector::empty()
        }
    }

    /// Get campaign type as string
    #[view]
    public fun get_campaign_type_string(campaign_type: u8): String {
        if (campaign_type == DONATION) {
            utf8(b"donation")
        } else if (campaign_type == BUSINESS) {
            utf8(b"business")
        } else if (campaign_type == PRODUCT) {
            utf8(b"product")
        } else {
            utf8(b"unknown")
        }
    }
}
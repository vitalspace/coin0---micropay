module campaign_blockchain::campaigns_per_user {
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
        donated_at: u64
    }

    /// Purchase structure
    struct Purchase has store, copy, drop {
        buyer: address,
        campaign_id: u64,
        quantity: u64,
        total_amount: u64,
        purchased_at: u64
    }

    /// Event structure for donations
    struct DonationMade has drop, store {
        donor: address,
        campaign_id: u64,
        amount: u64,
        donated_at: u64
    }

    /// Event structure for purchases
    struct PurchaseMade has drop, store {
        buyer: address,
        campaign_id: u64,
        quantity: u64,
        total_amount: u64,
        purchased_at: u64
    }

    /// Event structure for fund withdrawals
    struct FundsWithdrawn has drop, store {
        campaign_id: u64,
        withdrawn_by: address,
        amount: u64,
        withdrawn_at: u64
    }

    /// Campaign structure
    struct Campaign has store, copy, drop {
        id: u64,
        campaign_type: u8,
        name: String,
        description: String,
        goal: u64, // Para campañas de donación
        price: u64, // Para campañas de producto y negocio
        image: String,
        is_active: bool,
        created_by: address,
        created_at: u64,
        updated_at: u64
    }

    /// Event structure for campaign creation
    struct CampaignCreated has drop, store {
        campaign_id: u64,
        campaign_type: u8,
        name: String,
        created_by: address,
        created_at: u64
    }

    /// Event structure for campaign updates
    struct CampaignUpdated has drop, store {
        campaign_id: u64,
        updated_by: address,
        updated_at: u64
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
        next_campaign_id: u64
    }

    fun init_module(account: &signer) {
        move_to(
            account,
            CampaignStore {
                campaigns: table::new(),
                campaign_balances: table::new(),
                donations: table::new(),
                purchases: table::new(),
                campaign_events: account::new_event_handle<CampaignCreated>(account),
                update_events: account::new_event_handle<CampaignUpdated>(account),
                donation_events: account::new_event_handle<DonationMade>(account),
                purchase_events: account::new_event_handle<PurchaseMade>(account),
                withdrawal_events: account::new_event_handle<FundsWithdrawn>(account),
                next_campaign_id: 1
            }
        );
    }

    // Función helper para asegurar que el store existe
    fun ensure_store_exists(account: &signer) {
        let account_addr = signer::address_of(account);
        if (!exists<CampaignStore>(account_addr)) {
            move_to(
                account,
                CampaignStore {
                    campaigns: table::new(),
                    campaign_balances: table::new(),
                    donations: table::new(),
                    purchases: table::new(),
                    campaign_events: account::new_event_handle<CampaignCreated>(account),
                    update_events: account::new_event_handle<CampaignUpdated>(account),
                    donation_events: account::new_event_handle<DonationMade>(account),
                    purchase_events: account::new_event_handle<PurchaseMade>(account),
                    withdrawal_events: account::new_event_handle<FundsWithdrawn>(account),
                    next_campaign_id: 1
                }
            );
        };
    }

    // Función pública para inicializar el store de un usuario
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);

        // Verificar que no exista ya
        assert!(!exists<CampaignStore>(account_addr), 0xA); // Store already exists

        move_to(
            account,
            CampaignStore {
                campaigns: table::new(),
                campaign_balances: table::new(),
                donations: table::new(),
                purchases: table::new(),
                campaign_events: account::new_event_handle<CampaignCreated>(account),
                update_events: account::new_event_handle<CampaignUpdated>(account),
                donation_events: account::new_event_handle<DonationMade>(account),
                purchase_events: account::new_event_handle<PurchaseMade>(account),
                withdrawal_events: account::new_event_handle<FundsWithdrawn>(account),
                next_campaign_id: 1
            }
        );
    }

    /// Create a new donation campaign
    public entry fun create_donation_campaign(
        creator: &signer,
        name: String,
        description: String,
        goal: u64,
        image: String
    ) acquires CampaignStore {
        create_campaign(
            creator,
            DONATION,
            name,
            description,
            goal,
            0,
            image
        );
    }

    /// Create a new business campaign
    public entry fun create_business_campaign(
        creator: &signer,
        name: String,
        description: String,
        price: u64,
        image: String
    ) acquires CampaignStore {
        create_campaign(creator, BUSINESS, name, description, 0, price, image);
    }

    /// Create a new product campaign
    public entry fun create_product_campaign(
        creator: &signer,
        name: String,
        description: String,
        price: u64,
        image: String
    ) acquires CampaignStore {
        create_campaign(
            creator,
            PRODUCT,
            name,
            description,
            0,
            price,
            image
        );
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
        // Auto-inicializar si no existe
        ensure_store_exists(creator);

        let creator_addr = signer::address_of(creator);
        let campaign_store = borrow_global_mut<CampaignStore>(creator_addr);

        let campaign_id = campaign_store.next_campaign_id;
        let current_time = aptos_framework::timestamp::now_seconds();

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
            updated_at: current_time
        };

        campaign_store.campaigns.add(campaign_id, new_campaign);

        // Emit creation event
        event::emit_event(
            &mut campaign_store.campaign_events,
            CampaignCreated {
                campaign_id,
                campaign_type,
                name,
                created_by: creator_addr,
                created_at: current_time
            }
        );

        // Increment counter
        campaign_store.next_campaign_id = campaign_id + 1;
    }

    /// Update campaign active status
    public entry fun update_campaign_status(
        updater: &signer, campaign_id: u64, is_active: bool
    ) acquires CampaignStore {
        let updater_addr = signer::address_of(updater);
        let campaign_store = borrow_global_mut<CampaignStore>(updater_addr);

        assert!(campaign_store.campaigns.contains(campaign_id), 0x1);

        let campaign = campaign_store.campaigns.borrow_mut(campaign_id);
        campaign.is_active = is_active;
        campaign.updated_at = aptos_framework::timestamp::now_seconds();

        // Emit update event
        event::emit_event(
            &mut campaign_store.update_events,
            CampaignUpdated {
                campaign_id,
                updated_by: updater_addr,
                updated_at: campaign.updated_at
            }
        );
    }

    // Get campaign by ID
    #[view]
    public fun get_campaign(
        user_addr: address, campaign_id: u64
    ): (u64, u8, String, String, u64, u64, String, bool, address, u64, u64) acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        assert!(campaign_store.campaigns.contains(campaign_id), 0x1);

        let campaign = campaign_store.campaigns.borrow(campaign_id);
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
            campaign.updated_at
        )
    }

    // Get campaigns by creator
    #[view]
    public fun get_campaigns_by_creator(creator: address): vector<u64> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(creator);
        let campaign_ids = vector::empty<u64>();

        let campaign_id = 1;
        while (campaign_id < campaign_store.next_campaign_id) {
            if (campaign_store.campaigns.contains(campaign_id)) {
                let campaign = campaign_store.campaigns.borrow(campaign_id);
                if (campaign.created_by == creator) {
                    campaign_ids.push_back(campaign_id);
                };
            };
            campaign_id += 1;
        };

        campaign_ids
    }

    // Get all active campaigns
    #[view]
    public fun get_active_campaigns(user_addr: address): vector<u64> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        let active_campaigns = vector::empty<u64>();

        let campaign_id = 1;
        while (campaign_id < campaign_store.next_campaign_id) {
            if (campaign_store.campaigns.contains(campaign_id)) {
                let campaign = campaign_store.campaigns.borrow(campaign_id);
                if (campaign.is_active) {
                    active_campaigns.push_back(campaign_id);
                };
            };
            campaign_id += 1;
        };

        active_campaigns
    }

    // Get total number of campaigns
    #[view]
    public fun get_total_campaigns(user_addr: address): u64 acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        campaign_store.next_campaign_id - 1
    }

    // Check if campaign exists
    #[view]
    public fun campaign_exists(user_addr: address, campaign_id: u64): bool acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        campaign_store.campaigns.contains(campaign_id)
    }

    /// Donate to a donation campaign
    public entry fun donate_to_campaign(
        donor: &signer, creator_addr: address, campaign_id: u64, amount: u64
    ) acquires CampaignStore {
        let donor_addr = signer::address_of(donor);
        let campaign_store = borrow_global_mut<CampaignStore>(creator_addr);

        // Verificar que la campaña existe y está activa
        assert!(campaign_store.campaigns.contains(campaign_id), 0x1);
        let campaign = campaign_store.campaigns.borrow(campaign_id);
        assert!(campaign.is_active, 0x2);
        assert!(campaign.campaign_type == DONATION, 0x3); // Solo para campañas de donación
        assert!(amount > 0, 0x4);

        // Transferir APT del donador al creador
        coin::transfer<AptosCoin>(donor, creator_addr, amount);

        // Actualizar balance de la campaña
        let new_balance =
            if (campaign_store.campaign_balances.contains(campaign_id)) {
                *campaign_store.campaign_balances.borrow(campaign_id) + amount
            } else { amount };

        if (campaign_store.campaign_balances.contains(campaign_id)) {
            campaign_store.campaign_balances.remove(campaign_id);
        };
        campaign_store.campaign_balances.add(campaign_id, new_balance);

        // Registrar la donación
        let current_time = aptos_framework::timestamp::now_seconds();
        let donation = Donation {
            donor: donor_addr,
            campaign_id,
            amount,
            donated_at: current_time
        };

        if (!campaign_store.donations.contains(campaign_id)) {
            campaign_store.donations.add(campaign_id, vector::empty());
        };

        let donations = campaign_store.donations.borrow_mut(campaign_id);
        donations.push_back(donation);

        // Emitir evento de donación
        event::emit_event(
            &mut campaign_store.donation_events,
            DonationMade {
                donor: donor_addr,
                campaign_id,
                amount,
                donated_at: current_time
            }
        );
    }

    /// Purchase from a product campaign
    public entry fun purchase_product(
        buyer: &signer, creator_addr: address, campaign_id: u64, quantity: u64
    ) acquires CampaignStore {
        let buyer_addr = signer::address_of(buyer);
        let campaign_store = borrow_global_mut<CampaignStore>(creator_addr);

        // Verificar que la campaña existe y está activa
        assert!(campaign_store.campaigns.contains(campaign_id), 0x1);
        let campaign = campaign_store.campaigns.borrow(campaign_id);
        assert!(campaign.is_active, 0x2);
        assert!(campaign.campaign_type == PRODUCT, 0x3); // Solo para campañas de producto
        assert!(quantity > 0, 0x4);
        assert!(campaign.price > 0, 0x5);

        let total_amount = campaign.price * quantity;

        // Transferir APT del comprador al creador
        coin::transfer<AptosCoin>(buyer, creator_addr, total_amount);

        // Actualizar balance de la campaña
        let new_balance =
            if (campaign_store.campaign_balances.contains(campaign_id)) {
                *campaign_store.campaign_balances.borrow(campaign_id)
                    + total_amount
            } else {
                total_amount
            };

        if (campaign_store.campaign_balances.contains(campaign_id)) {
            campaign_store.campaign_balances.remove(campaign_id);
        };
        campaign_store.campaign_balances.add(campaign_id, new_balance);

        // Registrar la compra
        let current_time = aptos_framework::timestamp::now_seconds();
        let purchase = Purchase {
            buyer: buyer_addr,
            campaign_id,
            quantity,
            total_amount,
            purchased_at: current_time
        };

        if (!campaign_store.purchases.contains(campaign_id)) {
            campaign_store.purchases.add(campaign_id, vector::empty());
        };

        let purchases = campaign_store.purchases.borrow_mut(campaign_id);
        purchases.push_back(purchase);

        // Emitir evento de compra
        event::emit_event(
            &mut campaign_store.purchase_events,
            PurchaseMade {
                buyer: buyer_addr,
                campaign_id,
                quantity,
                total_amount,
                purchased_at: current_time
            }
        );
    }

    /// Purchase from a business campaign
    public entry fun purchase_business_service(
        buyer: &signer, creator_addr: address, campaign_id: u64
    ) acquires CampaignStore {
        let buyer_addr = signer::address_of(buyer);
        let campaign_store = borrow_global_mut<CampaignStore>(creator_addr);

        // Verificar que la campaña existe y está activa
        assert!(campaign_store.campaigns.contains(campaign_id), 0x1);
        let campaign = campaign_store.campaigns.borrow(campaign_id);
        assert!(campaign.is_active, 0x2);
        assert!(campaign.campaign_type == BUSINESS, 0x3); // Solo para campañas de negocio
        assert!(campaign.price > 0, 0x5);

        let total_amount = campaign.price; // For business, quantity=1

        // Transferir APT del comprador al creador
        coin::transfer<AptosCoin>(buyer, creator_addr, total_amount);

        // Actualizar balance de la campaña
        let new_balance =
            if (campaign_store.campaign_balances.contains(campaign_id)) {
                *campaign_store.campaign_balances.borrow(campaign_id) + total_amount
            } else {
                total_amount
            };

        if (campaign_store.campaign_balances.contains(campaign_id)) {
            campaign_store.campaign_balances.remove(campaign_id);
        };
        campaign_store.campaign_balances.add(campaign_id, new_balance);

        // Registrar la compra
        let current_time = aptos_framework::timestamp::now_seconds();
        let purchase = Purchase {
            buyer: buyer_addr,
            campaign_id,
            quantity: 1, // Fixed for business
            total_amount,
            purchased_at: current_time
        };

        if (!campaign_store.purchases.contains(campaign_id)) {
            campaign_store.purchases.add(campaign_id, vector::empty());
        };

        let purchases = campaign_store.purchases.borrow_mut(campaign_id);
        purchases.push_back(purchase);

        // Emitir evento de compra
        event::emit_event(
            &mut campaign_store.purchase_events,
            PurchaseMade {
                buyer: buyer_addr,
                campaign_id,
                quantity: 1,
                total_amount,
                purchased_at: current_time
            }
        );
    }

    /// Withdraw funds from campaign (only by campaign creator)
    public entry fun withdraw_funds(
        campaign_creator: &signer, campaign_id: u64, amount: u64
    ) acquires CampaignStore {
        let creator_addr = signer::address_of(campaign_creator);
        let campaign_store = borrow_global_mut<CampaignStore>(creator_addr);

        // Verificar que la campaña existe
        assert!(campaign_store.campaigns.contains(campaign_id), 0x1);
        let campaign = campaign_store.campaigns.borrow(campaign_id);

        // Solo el creador puede retirar fondos
        assert!(campaign.created_by == creator_addr, 0x6);
        assert!(amount > 0, 0x4);

        // Verificar que hay suficiente balance
        assert!(campaign_store.campaign_balances.contains(campaign_id), 0x7);
        let current_balance =
            *campaign_store.campaign_balances.borrow(campaign_id);
        assert!(current_balance >= amount, 0x8);

        // En per-user, los fondos ya están en la cuenta del creador, solo actualizar balance
        let new_balance = current_balance - amount;
        campaign_store.campaign_balances.remove(campaign_id);
        campaign_store.campaign_balances.add(campaign_id, new_balance);

        // Emitir evento de retiro
        let current_time = aptos_framework::timestamp::now_seconds();
        event::emit_event(
            &mut campaign_store.withdrawal_events,
            FundsWithdrawn {
                campaign_id,
                withdrawn_by: creator_addr,
                amount,
                withdrawn_at: current_time
            }
        );
    }

    // Get campaign balance
    #[view]
    public fun get_campaign_balance(user_addr: address, campaign_id: u64): u64 acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        if (campaign_store.campaign_balances.contains(campaign_id)) {
            *campaign_store.campaign_balances.borrow(campaign_id)
        } else { 0 }
    }

    // Get campaign progress (for donation campaigns)
    #[view]
    public fun get_campaign_progress(user_addr: address, campaign_id: u64): (u64, u64) acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        assert!(campaign_store.campaigns.contains(campaign_id), 0x1);

        let campaign = campaign_store.campaigns.borrow(campaign_id);
        assert!(campaign.campaign_type == DONATION, 0x3);

        let current_balance =
            if (campaign_store.campaign_balances.contains(campaign_id)) {
                *campaign_store.campaign_balances.borrow(campaign_id)
            } else { 0 };
        (current_balance, campaign.goal)
    }

    // Get donation history for a campaign
    #[view]
    public fun get_donation_history(user_addr: address, campaign_id: u64): vector<Donation> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        if (campaign_store.donations.contains(campaign_id)) {
            *campaign_store.donations.borrow(campaign_id)
        } else {
            vector::empty()
        }
    }

    // Get purchase history for a campaign
    #[view]
    public fun get_purchase_history(user_addr: address, campaign_id: u64): vector<Purchase> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        if (campaign_store.purchases.contains(campaign_id)) {
            *campaign_store.purchases.borrow(campaign_id)
        } else {
            vector::empty()
        }
    }
    // Get all campaigns
    #[view]
    public fun get_all_campaigns(user_addr: address): vector<Campaign> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        let all_campaigns = vector::empty<Campaign>();
        let campaign_id = 1;
        while (campaign_id < campaign_store.next_campaign_id) {
            if (campaign_store.campaigns.contains(campaign_id)) {
                let campaign = *campaign_store.campaigns.borrow(campaign_id);
                all_campaigns.push_back(campaign);
            };
            campaign_id += 1;
        };
        all_campaigns
    }

    // Get total balance of all campaigns
    #[view]
    public fun get_total_balance(user_addr: address): u64 acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        let total = 0;
        let campaign_id = 1;
        while (campaign_id < campaign_store.next_campaign_id) {
            if (campaign_store.campaign_balances.contains(campaign_id)) {
                total += *campaign_store.campaign_balances.borrow(campaign_id);
            };
            campaign_id += 1;
        };
        total
    }

    // Get campaign type as string
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

    // Get all unique supporters (donors and buyers) across all campaigns
    #[view]
    public fun get_all_supporters(user_addr: address): vector<address> acquires CampaignStore {
        let campaign_store = borrow_global<CampaignStore>(user_addr);
        let supporters = vector::empty<address>();

        let campaign_id = 1;
        while (campaign_id < campaign_store.next_campaign_id) {
            // Collect donors from donations
            if (campaign_store.donations.contains(campaign_id)) {
                let donations = campaign_store.donations.borrow(campaign_id);
                let i = 0;
                while (i < vector::length(donations)) {
                    let donation = donations.borrow(i);
                    if (!supporters.contains(&donation.donor)) {
                        supporters.push_back(donation.donor);
                    };
                    i += 1;
                };
            };

            // Collect buyers from purchases
            if (campaign_store.purchases.contains(campaign_id)) {
                let purchases = campaign_store.purchases.borrow(campaign_id);
                let j = 0;
                while (j < vector::length(purchases)) {
                    let purchase = purchases.borrow(j);
                    if (!supporters.contains(&purchase.buyer)) {
                        supporters.push_back(purchase.buyer);
                    };
                    j += 1;
                };
            };

            campaign_id += 1;
        };

        supporters
    }

    #[view]
    public fun store_exists(account_addr: address): bool {
        exists<CampaignStore>(account_addr)
    }
}
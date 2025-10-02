module todo_blockchain::tasks {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_std::table_with_length::{Self, TableWithLength};

    struct Task has store, drop, copy {
        id: u64,
        description: String,
        completed: bool
    }

    struct TodoStore has key {
        tasks: TableWithLength<u64, Task>,
        next_id: u64
    }

    fun init_module(account: &signer) {
        move_to(
            account,
            TodoStore { tasks: table_with_length::new(), next_id: 1 }
        );
    }

    // Función helper para asegurar que el store existe
    fun ensure_store_exists(account: &signer) {
        let account_addr = signer::address_of(account);
        if (!exists<TodoStore>(account_addr)) {
            move_to(
                account,
                TodoStore { tasks: table_with_length::new(), next_id: 1 }
            );
        };
    }

    // Función pública para inicializar el store de un usuario
    public entry fun init_user_store(account: &signer) {
        let account_addr = signer::address_of(account);
        
        // Verificar que no exista ya
        assert!(!exists<TodoStore>(account_addr), 2); // Store already exists
        
        move_to(
            account,
            TodoStore { tasks: table_with_length::new(), next_id: 1 }
        );
    }

    public entry fun create_task(account: &signer, description: String) acquires TodoStore {
        // Auto-inicializar si no existe
        ensure_store_exists(account);
        
        let store = borrow_global_mut<TodoStore>(signer::address_of(account));
        let id = store.next_id;
        store.next_id += 1;
        let task = Task { id, description, completed: false };
        store.tasks.add(id, task);
    }

    public entry fun update_task(
        account: &signer,
        id: u64,
        description: String,
        completed: bool
    ) acquires TodoStore {
        let store = borrow_global_mut<TodoStore>(signer::address_of(account));
        assert!(store.tasks.contains(id), 1); // Task not found
        let task = store.tasks.borrow_mut(id);
        task.description = description;
        task.completed = completed;
    }

    public entry fun toggle_task(account: &signer, id: u64) acquires TodoStore {
        let store = borrow_global_mut<TodoStore>(signer::address_of(account));
        assert!(store.tasks.contains(id), 1); // Task not found
        let task = store.tasks.borrow_mut(id);
        task.completed = !task.completed;
    }

    public entry fun remove_task(account: &signer, id: u64) acquires TodoStore {
        let store = borrow_global_mut<TodoStore>(signer::address_of(account));
        assert!(store.tasks.contains(id), 1); // Task not found
        store.tasks.remove(id);
    }

    #[view]
    public fun get_all_tasks(account_addr: address): vector<Task> acquires TodoStore {
        // Verificar si el store existe
        if (!exists<TodoStore>(account_addr)) {
            return vector::empty<Task>()
        };
        
        let store = borrow_global<TodoStore>(account_addr);
        let tasks = vector::empty<Task>();
        let i = 1;
        
        while (i < store.next_id) {
            if (store.tasks.contains(i)) {
                let task = *store.tasks.borrow(i);
                tasks.push_back(task);
            };
            i += 1;
        };
        
        tasks
    }

    #[view]
    public fun get_task(account_addr: address, id: u64): Task acquires TodoStore {
        assert!(exists<TodoStore>(account_addr), 3); // Store not found
        let store = borrow_global<TodoStore>(account_addr);
        assert!(store.tasks.contains(id), 1); // Task not found

        *store.tasks.borrow(id)
    }

    #[view]
    public fun get_task_count(account_addr: address): u64 acquires TodoStore {
        if (!exists<TodoStore>(account_addr)) {
            return 0
        };
        
        let store = borrow_global<TodoStore>(account_addr);
        store.tasks.length()
    }

    #[view]
    public fun store_exists(account_addr: address): bool {
        exists<TodoStore>(account_addr)
    }
}
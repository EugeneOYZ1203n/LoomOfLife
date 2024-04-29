import { open } from '@tauri-apps/api/dialog';
import { appConfigDir } from '@tauri-apps/api/path';
import { Store } from "tauri-plugin-store-api";
import "./VaultSelection.css";

function VaultSelection() {

    const chooseVault = async () => {
        try {
            const store = new Store(".settings.dat");

            let current_path = await store.get("vault_path");

            if (current_path){
                current_path = current_path.value;
            }
            else{
                current_path = await appConfigDir();
            }
            
            const selected = await open({
                title: "Choose Vault Directory",
                directory: true,
                multiple: false,
                defaultPath: current_path,
            });

            if (selected == null) {
                return;
            }

            await store.set("vault_path", {value: selected});

            await store.save();
        } catch (err) {
            console.error(err);
        }
    }

    const clearStore = async () => {
        const store = new Store(".settings.dat");

        await store.clear();
    }

    return (
        <><div onClick={() => chooseVault()}>
            Vault
        </div>
        <div onClick={() => clearStore()}>
            Test Clear Store
        </div></>
    );
}

export default VaultSelection;
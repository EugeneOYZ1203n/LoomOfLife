import { open } from '@tauri-apps/api/dialog';
import { relaunch } from '@tauri-apps/api/process';
import { appConfigDir } from '@tauri-apps/api/path';
import { Store } from "tauri-plugin-store-api";
import "./VaultSelection.css";
import { useContext, useState } from 'react';
import { VaultContext } from '../CalendarView';


const store = new Store(".settings.dat");

function VaultSelection() {

    const [vaultPath, setVaultPath] = useContext(VaultContext);

    const chooseVault = async () => {
        try {
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

            setVaultPath(selected);

            await relaunch();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <><div onClick={() => chooseVault()}>
            Vault
        </div>
        <div>
            {vaultPath}
        </div></>
    );
}

export default VaultSelection;
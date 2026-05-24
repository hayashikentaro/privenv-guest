export interface GuestManifest {
  version: string;
  capabilities: ManifestCapability[];
}

export interface ManifestCapability {
  id: string;
  kind: "command";
  description: string;
  command?: {
    program: string;
    args: string[];
  };
  env: ManifestEnvReference[];
}

export interface ManifestEnvReference {
  name: string;
  source?: "secret";
  exposedToGuest: false;
}

import { TacticalClient } from "./TacticalClient";

export let tacticalClient = new TacticalClient(import.meta.env.DEV ? 'http://localhost:3001' : 'https://tactical-server.herokuapp.com');
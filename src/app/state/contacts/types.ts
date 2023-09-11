export interface Contact {
  address: string
  name: string
}

/* --- STATE --- */
export interface ContactsState {
  [address: string]: Contact
}

export interface AuthState {
user: { id: string; email: string } | null
token: string | null
loading: boolean
error?: string | null
}
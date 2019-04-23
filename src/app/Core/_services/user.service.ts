import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    //
    // ─── GET ALL CONNECTIONS FOR A GIVEN USER ───────────────────────────────────────────────────
    //

        getConnections(id: number) {
            return this.http.get(`${environment.apiUrl}/chatkit/connections/${id}`)
        }
    // ────────────────────────────────────────────────────────────────────────────────



    //
    // ─── UPDATE ──────────────────────────────────────────────────────────────
    //

        update(userId, data) {
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            })

            return this.http.post(`${environment.apiUrl}/chatkit/user/${userId}`, data, {headers: headers})
        }
    // ─────────────────────────────────────────────────────────────────



    //
    // ─── SEND AN INVITE TO THE REQUESTED USER ───────────────────────────────────────
    //

        inviteConnection(userId) {
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            })

            const data = JSON.stringify({ 'userId': `${userId}` })

            return this.http.post(`${environment.apiUrl}/chatkit/invite/`, data, {headers: headers})
        }
    // ────────────────────────────────────────────────────────────────────────────────



    getAll() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        })

        return this.http.get<any[]>(`${environment.apiUrl}/chatkit/users`)
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/okta/users/` + id)
    }

    register(user: any) {
        return this.http.post(`${environment.apiUrl}/users/register`, user)
    }

    // update(user: any) {
    //     console.log(user)
    //     return this.http.put(`${environment.apiUrl}/updateUser/` + user.id, user)
    // }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/okta/users/` + id)
    }
}

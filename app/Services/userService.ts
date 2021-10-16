import * as DA from "../DA/namespace";
import { User } from "../Objects/User";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";
import { StateService } from "./stateService";

export class userService {
    private userDA = new DA.user();

    /**
     * signin
     */
    public signin(name: string, password: string): Observable<boolean> {
        return this.userDA.get(name, password).pipe(
            tap((user: User) => {
                if (user) {
                    StateService.getInstance().userId = user._id;
                }
            }),
            map((user: User) => {
                return !!user;
            }),
        );
    }


    /**
     * signup
     */
    public signup(name: string, password: string, email: string): Observable<any> {
        return this.userDA.addUser(name, password, email);
    }
}
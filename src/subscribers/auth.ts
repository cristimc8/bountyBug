import { EventSubscriber, On } from "event-dispatch";
import { events } from "@/subscribers/events";

@EventSubscriber()
export default class Auth {
  @On(events.auth.signInRequest)
  async onMobileGoogleSignInRequest({payload}) {
    console.log(`auth requested with payload`)
    /*User.findOrCreate({email: payload.email, name: payload.name, picture: payload.picture}, (err, user) => {
    });*/
  }
}

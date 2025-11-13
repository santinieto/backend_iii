import CustomRouter from "../custom.router.js";
import { testEmail } from "../../helpers/email.helper.js";

const sendTestEmail = async (req, res) => {
    await testEmail();
    res.json200("Test email sent successfully");
};

class MailingRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init = () => {
        this.read("/test", ["public"], sendTestEmail);
    };
}

const mailingRouter = new MailingRouter().getRouter();

export default mailingRouter;

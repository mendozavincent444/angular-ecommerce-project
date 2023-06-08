import { AbstractControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    public static notOnlyWhiteSpace(control: AbstractControl): ValidationErrors | null {

        if ((control.value != null) && (control.value.trim().length === 0)) {
            return { "notOnlyWhiteSpace": true };
        } else {
            return null;
        }

    }


}

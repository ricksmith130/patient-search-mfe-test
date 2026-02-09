import { ACTIVITY_CODE_POSTCODE_SEARCH } from "ncrs-host/RbacConstants";
import { UserDetailsState } from "ncrs-host/AppStateTypes";

export function hasValidRole(roleDetails: UserDetailsState): boolean {
    const roles = roleDetails.allowedRoles.filter(
        (role: any) =>
            role.roleId == roleDetails.roleId &&
            role.activity_codes.includes(ACTIVITY_CODE_POSTCODE_SEARCH)
    );
    return roles.length > 0;
}

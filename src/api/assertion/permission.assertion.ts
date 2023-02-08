import { expect, test } from '@playwright/test';
import _ from "lodash";

async function checkOwnerOrAdminPermission(responseBody: any) {
    expect(responseBody.hasCreateTableRight, `Verify hasCreateTableRight status: true`).toBeTruthy()
    expect(responseBody.hasEditTableRight, `Verify hasEditTableRight status: true`).toBeTruthy()
    expect(responseBody.hasViewTableRight, `Verify hasViewTableRight status: true`).toBeTruthy()
    expect(responseBody.hasEditRight, `Verify hasEditRight status: true`).toBeTruthy()
    expect(responseBody.hasViewClosedStatusRight, `Verify hasViewClosedStatusRight status: true`).toBeTruthy()
    expect(responseBody.hasManageTeamRight, `Verify hasManageTeamRight status: true`).toBeTruthy()
}

async function checkMemberPermission(responseBody: any) {
    expect(responseBody.hasCreateTableRight, `Verify hasCreateTableRight status: false`).toBeFalsy()
    expect(responseBody.hasEditTableRight, `Verify hasEditTableRight status: false`).toBeFalsy()
    expect(responseBody.hasViewTableRight, `Verify hasViewTableRight status: false`).toBeTruthy()
    expect(responseBody.hasEditRight, `Verify hasEditRight status: false`).toBeTruthy()
    expect(responseBody.hasViewClosedStatusRight, `Verify hasViewClosedStatusRight status: false`).toBeTruthy()
    expect(responseBody.hasManageTeamRight, `Verify hasManageTeamRight status: false`).toBeFalsy()
}

async function checkViewerPermission(responseBody: any) {
    expect(responseBody.hasCreateTableRight, `Verify hasCreateTableRight status: false`).toBeFalsy()
    expect(responseBody.hasEditTableRight, `Verify hasEditTableRight status: false`).toBeFalsy()
    expect(responseBody.hasViewTableRight, `Verify hasViewTableRight status: false`).toBeFalsy()
    expect(responseBody.hasEditRight, `Verify hasEditRight status: false`).toBeFalsy()
    expect(responseBody.hasViewClosedStatusRight, `Verify hasViewClosedStatusRight status: false`).toBeFalsy()
    expect(responseBody.hasManageTeamRight, `Verify hasManageTeamRight status: false`).toBeFalsy()
}

export {  
    checkOwnerOrAdminPermission,
    checkMemberPermission,
    checkViewerPermission
}

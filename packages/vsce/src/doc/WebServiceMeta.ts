/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { IWebService } from "@zowe/cics-for-zowe-sdk";
import constants from "../utils/constants";
import { getDefaultFilter } from "../utils/filterUtils";
import { ResourceMeta } from "./IResourceMeta";


export const WebServiceMeta: ResourceMeta<IWebService> = {

  resourceName: "CICSWebService",
  humanReadableName: "Web Services",
  contextPrefix: "cicstreewebservice",
  combinedContextPrefix: "cicscombinedwebservicetree",
  filterAttribute: "NAME",
  primaryKeyAttribute: "name",

  persistentStorageKey: "webservices",
  persistentStorageAllKey: "allWebServices",

  getDefaultFilter: function (): Promise<string> {
    return getDefaultFilter(constants.PERSISTENT_STORAGE.WEBSERVICE_FILTER);
  },

  getLabel: function (webservice: IWebService): string {
    const label = `${webservice.name}`;
    return label;
  },

  getContext: function (webservice: IWebService): string {
    return `cicswebservice.${webservice.name}`;
  },

  getIconName: function (_webservice: IWebService): string {
    return `program`;
  }

};


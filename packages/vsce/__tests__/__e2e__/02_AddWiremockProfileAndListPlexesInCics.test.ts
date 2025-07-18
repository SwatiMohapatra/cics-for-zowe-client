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

import { expect } from "chai";
import { DefaultTreeSection, EditorView, InputBox, SideBarView, TreeItem } from "vscode-extension-tester";
import { CICSEX61, CONFIG_FILE_NAME, DUMMY907, WIREMOCK_PROFILE_NAME } from "./util/constants";
import { addWiremockProfileToConfigFile, sleep } from "./util/globalMocks";
import {
  checkIfEditorTabIsOpened,
  clickCollapseAllsIconInCicsTree,
  clickPlusIconInCicsTree,
  closeAllEditorsTabs,
  getCicsSection,
  openZoweExplorer,
  selectEditProjectTeamConfigFile,
} from "./util/initSetup.test";

describe("Adding Wiremock Profile, List CICSplexes", () => {
  let view: SideBarView;
  let cicsTree: DefaultTreeSection;
  let quickPick: InputBox;
  let editorView: EditorView;

  before(async () => {
    await sleep(1900);
    view = await openZoweExplorer();
    cicsTree = await getCicsSection(view);
    await sleep(100);
  });

  beforeEach(async () => {
    // Expand the cics section
    await cicsTree.click();
  });

  after(async () => {
    await closeAllEditorsTabs();
    await clickCollapseAllsIconInCicsTree(cicsTree);
  });

  describe("Add Wiremock to Config File", () => {
    it("Add Wiremock", async () => {
      // Add wiremock profile to the zowe.config.json
      addWiremockProfileToConfigFile();

      // Select the option to edit project team configuration file from the quickpick
      await selectEditProjectTeamConfigFile(cicsTree);
      await checkIfEditorTabIsOpened(CONFIG_FILE_NAME);

      // Check if wiremock profile is added to the zowe.config.json
      editorView = new EditorView();
      const editor = await editorView.openEditor(CONFIG_FILE_NAME);
      const isWmAvailable = await editor.getText();
      expect(isWmAvailable.includes(WIREMOCK_PROFILE_NAME)).to.be.true;
      cicsTree.takeScreenshot();
    });
  });

  describe("Check For Wiremock, List Plexes", async () => {
    let wiremockServer: TreeItem | undefined;

    it("Add The Wiremock Profile To The Tree", async () => {
      await clickPlusIconInCicsTree(cicsTree);

      // Find quickpick
      quickPick = await InputBox.create();
      const qpItems = await quickPick.getQuickPicks();
      const qpLen = qpItems.length;

      // Selecting wiremock_server from the quickpick
      let i, wiremockLabel;
      for (i = 0; i < qpLen; i++) {
        wiremockLabel = await qpItems[i].getLabel();
        if (wiremockLabel.includes(WIREMOCK_PROFILE_NAME)) {
          break;
        }
      }
      expect(wiremockLabel).contains(WIREMOCK_PROFILE_NAME);
      if (i < qpLen) {
        await quickPick.selectQuickPick(i);
      }
      cicsTree.takeScreenshot();
    });

    it("Check for Wiremock in CICS tree", async () => {
      // Checking if wiremock_server profile is available under the cics section
      wiremockServer = await cicsTree.findItem(WIREMOCK_PROFILE_NAME);
      expect(wiremockServer).exist;

      // Title check for wiremork profile
      const wmSeverLabel = await wiremockServer?.getLabel();
      expect(wmSeverLabel).equals(WIREMOCK_PROFILE_NAME);
      cicsTree.takeScreenshot();
    });

    it("List CICSplexes Under Wiremock", async () => {
      // Should expand the wiremock_profile and check for the plexes present under it
      const plexes = await cicsTree.openItem(WIREMOCK_PROFILE_NAME);
      expect(plexes).exist;

      const plex1 = await plexes[0].getLabel();
      expect(plex1).contains(CICSEX61);

      const plex2 = await plexes[1].getLabel();
      expect(plex2).contains(DUMMY907);
      cicsTree.takeScreenshot();
    });
  });
});

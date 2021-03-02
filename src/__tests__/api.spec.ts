// Note: All imports in this file should come from "../" ie index.ts'
// To ensure that all types used are exported properly
import {
	IMOSListMachInfo,
	IMOSAck,
	MosItemReplaceOptions,
	MosConnection,
	IConnectionConfig,
	IMOSDeviceConnectionOptions,
	MosDevice,
	IProfiles,
	IMOSConnectionStatus,
	IMOSObject,
	IMOSItem,
	IMOSItemAction,
	IMOSItemStatus,
	IMosObjectList,
	IMosRequestObjectList,
	IMOSROAck,
	IMOSROAction,
	IMOSROFullStory,
	IMOSROReadyToAir,
	IMOSROStory,
	IMOSRunningOrder,
	IMOSRunningOrderBase,
	IMOSRunningOrderStatus,
	IMOSSearchableSchema,
	IMOSStoryAction,
	IMOSStoryStatus,
	MosString128
} from '../'

test('api & exports', () => {
	// Note: This test doesn't test anything during runtime, but it touches types instead.

	// @ts-ignore not used
	function justTestTypings () {
		let f: any

		// MosConnection
		f = function (options: IConnectionConfig) {
			const mosConnection = new MosConnection(options)

			f = function (): Promise<boolean> { return mosConnection.init() }
			f = function (connectionOptions: IMOSDeviceConnectionOptions): Promise<MosDevice> { return mosConnection.connect(connectionOptions) }
			f = function (cb: (mosDevice: MosDevice) => void): void { return mosConnection.onConnection(cb) }
			f = function (): boolean { return mosConnection.isListening }
			f = function (): boolean { return mosConnection.isCompliant }
			f = function (): boolean { return mosConnection.acceptsConnections }
			f = function (): IProfiles { return mosConnection.profiles }
			f = function (): Promise<void> { return mosConnection.dispose() }
			f = function (id: string): MosDevice { return mosConnection.getDevice(id) }
			f = function (): MosDevice[] { return mosConnection.getDevices() }
			f = function (mosDevice: MosDevice): Promise<void> { return mosConnection.disposeMosDevice(mosDevice) }
			f = function (myMosID: string, theirMosId0: string, theirMosId1: string | null): Promise<void> { return mosConnection.disposeMosDevice(myMosID, theirMosId0, theirMosId1) }
			f = function (): string { return mosConnection.complianceText }
			f = function (debug: boolean): void { return mosConnection.setDebug(debug) }

		}
		// MosDevice

		// consumer won't have to construct the mosDevice, it is returned from mosConnection.connect()
		f = function (mosDevice: MosDevice) {

			f = function (): string { return mosDevice.idPrimary }
			f = function (): string | null { return mosDevice.idSecondary }
			/* Profile 0 */
			f = function (): Promise<IMOSListMachInfo> { return mosDevice.getMachineInfo() }
			f = function (cb: () => Promise<IMOSListMachInfo>): void { return mosDevice.onGetMachineInfo(cb) }
			f = function (cb: (connectionStatus: IMOSConnectionStatus) => void): void { return mosDevice.onConnectionChange(cb) }
			f = function (): IMOSConnectionStatus { return mosDevice.getConnectionStatus() }

			/* Profile 1 */
			f = function (obj: IMOSObject): Promise<IMOSAck> { return mosDevice.sendMOSObject(obj) }
			f = function (cb: (objId: string) => Promise<IMOSObject | null>): void { return mosDevice.onRequestMOSObject(cb) }
			f = function (objId: MosString128): Promise<IMOSObject> { return mosDevice.getMOSObject(objId) }
			f = function (cb: () => Promise<Array<IMOSObject>>): void { return mosDevice.onRequestAllMOSObjects(cb) }
			f = function (): Promise<Array<IMOSObject>> { return mosDevice.getAllMOSObjects() }
			f = function (objs: IMOSObject[]): Promise<IMOSAck> { return mosDevice.sendAllMOSObjects(objs) }

			/* Profile 2 */
			f = function (cb: (ro: IMOSRunningOrder) => Promise<IMOSROAck>): void { return mosDevice.onCreateRunningOrder(cb) }
			f = function (ro: IMOSRunningOrder): Promise<IMOSROAck> { return mosDevice.sendCreateRunningOrder(ro) }
			f = function (cb: (ro: IMOSRunningOrder) => Promise<IMOSROAck>): void { return mosDevice.onReplaceRunningOrder(cb) }
			f = function (ro: IMOSRunningOrder): Promise<IMOSROAck> { return mosDevice.sendReplaceRunningOrder(ro) }
			f = function (cb: (runningOrderId: MosString128) => Promise<IMOSROAck>): void { return mosDevice.onDeleteRunningOrder(cb) }
			f = function (runningOrderId: MosString128): Promise<IMOSROAck> { return mosDevice.sendDeleteRunningOrder(runningOrderId) }
			f = function (cb: (runningOrderId: MosString128) => Promise<IMOSRunningOrder | null>): void { return mosDevice.onRequestRunningOrder(cb) }
			f = function (runningOrderId: MosString128): Promise<IMOSRunningOrder | null> { return mosDevice.sendRequestRunningOrder(runningOrderId) }
			// f = function (runningOrderId: MosString128): Promise<IMOSRunningOrder | null> { return mosDevice.getRunningOrder(runningOrderId) }
			f = function (cb: (metadata: IMOSRunningOrderBase) => Promise<IMOSROAck>): void { return mosDevice.onMetadataReplace(cb) }
			f = function (metadata: IMOSRunningOrderBase): Promise<IMOSROAck> { return mosDevice.sendMetadataReplace(metadata) }
			f = function (cb: (status: IMOSRunningOrderStatus) => Promise<IMOSROAck>): void { return mosDevice.onRunningOrderStatus(cb) }
			f = function (cb: (status: IMOSStoryStatus) => Promise<IMOSROAck>): void { return mosDevice.onStoryStatus(cb) }
			f = function (cb: (status: IMOSItemStatus) => Promise<IMOSROAck>): void { return mosDevice.onItemStatus(cb) }
			f = function (status: IMOSRunningOrderStatus): Promise<IMOSROAck> { return mosDevice.sendRunningOrderStatus(status) }
			f = function (status: IMOSStoryStatus): Promise<IMOSROAck> { return mosDevice.sendStoryStatus(status) }
			f = function (status: IMOSItemStatus): Promise<IMOSROAck> { return mosDevice.sendItemStatus(status) }
			f = function (cb: (Action: IMOSROReadyToAir) => Promise<IMOSROAck>): void { return mosDevice.onReadyToAir(cb) }
			f = function (cb: (Action: IMOSStoryAction, Stories: Array<IMOSROStory>) => Promise<IMOSROAck>): void { return mosDevice.onROInsertStories(cb) }
			f = function (Action: IMOSStoryAction, Stories: Array<IMOSROStory>): Promise<IMOSROAck> { return mosDevice.sendROInsertStories(Action, Stories) }
			f = function (cb: (Action: IMOSItemAction, Items: Array<IMOSItem>) => Promise<IMOSROAck>): void { return mosDevice.onROInsertItems(cb) }
			f = function (Action: IMOSItemAction, Items: Array<IMOSItem>): Promise<IMOSROAck> { return mosDevice.sendROInsertItems(Action, Items) }
			f = function (cb: (Action: IMOSStoryAction, Stories: Array<IMOSROStory>) => Promise<IMOSROAck>): void { return mosDevice.onROReplaceStories(cb) }
			f = function (Action: IMOSStoryAction, Stories: Array<IMOSROStory>): Promise<IMOSROAck> { return mosDevice.sendROReplaceStories(Action, Stories) }
			f = function (cb: (Action: IMOSItemAction, Items: Array<IMOSItem>) => Promise<IMOSROAck>): void { return mosDevice.onROReplaceItems(cb) }
			f = function (Action: IMOSItemAction, Items: Array<IMOSItem>): Promise<IMOSROAck> { return mosDevice.sendROReplaceItems(Action, Items) }
			f = function (cb: (Action: IMOSStoryAction, Stories: Array<MosString128>) => Promise<IMOSROAck>): void { return mosDevice.onROMoveStories(cb) }
			f = function (Action: IMOSStoryAction, Stories: Array<MosString128>): Promise<IMOSROAck> { return mosDevice.sendROMoveStories(Action, Stories) }
			f = function (cb: (Action: IMOSItemAction, Items: Array<MosString128>) => Promise<IMOSROAck>): void { return mosDevice.onROMoveItems(cb) }
			f = function (Action: IMOSItemAction, Items: Array<MosString128>): Promise<IMOSROAck> { return mosDevice.sendROMoveItems(Action, Items) }
			f = function (cb: (Action: IMOSROAction, Stories: Array<MosString128>) => Promise<IMOSROAck>): void { return mosDevice.onRODeleteStories(cb) }
			f = function (Action: IMOSROAction, Stories: Array<MosString128>): Promise<IMOSROAck> { return mosDevice.sendRODeleteStories(Action, Stories) }
			f = function (cb: (Action: IMOSStoryAction, Items: Array<MosString128>) => Promise<IMOSROAck>): void { return mosDevice.onRODeleteItems(cb) }
			f = function (Action: IMOSStoryAction, Items: Array<MosString128>): Promise<IMOSROAck> { return mosDevice.sendRODeleteItems(Action, Items) }
			f = function (cb: (Action: IMOSROAction, StoryID0: MosString128, StoryID1: MosString128) => Promise<IMOSROAck>): void { return mosDevice.onROSwapStories(cb) }
			f = function (Action: IMOSROAction, StoryID0: MosString128, StoryID1: MosString128): Promise<IMOSROAck> { return mosDevice.sendROSwapStories(Action, StoryID0, StoryID1) }
			f = function (cb: (Action: IMOSStoryAction, ItemID0: MosString128, ItemID1: MosString128) => Promise<IMOSROAck>): void { return mosDevice.onROSwapItems(cb) }
			f = function (Action: IMOSStoryAction, ItemID0: MosString128, ItemID1: MosString128): Promise<IMOSROAck> { return mosDevice.sendROSwapItems(Action, ItemID0, ItemID1) }

			/* Profile 3 */
			f = function (cb: (object: IMOSObject) => Promise<IMOSAck>): void { return mosDevice.onMosObjCreate(cb) }
			f = function (object: IMOSObject): Promise<IMOSAck> { return mosDevice.mosObjCreate(object) }
			f = function (cb: (roID: MosString128, storyID: MosString128, item: IMOSItem) => Promise<IMOSROAck>): void { return mosDevice.onMosItemReplace(cb) }
			f = function (options: MosItemReplaceOptions): Promise<IMOSROAck> { return mosDevice.mosItemReplace(options) }
			f = function (cb: (username: string) => Promise<IMOSSearchableSchema>): void { return mosDevice.onMosReqSearchableSchema(cb) }
			f = function (username: string): Promise<IMOSSearchableSchema> { return mosDevice.mosRequestSearchableSchema(username) }
			f = function (cb: (objList: IMosRequestObjectList) => Promise<IMosObjectList>): void { return mosDevice.onMosReqObjectList(cb) }
			f = function (reqObjList: IMosRequestObjectList): Promise<IMosObjectList> { return mosDevice.mosRequestObjectList(reqObjList) }
			f = function (cb: (action: string, obj: IMOSObject) => Promise<IMOSAck>): void { return mosDevice.onMosReqObjectAction(cb) }

			/* Profile 4 */
			f = function (cb: () => Promise<IMOSRunningOrder[]>): void { return mosDevice.onROReqAll(cb) }
			f = function (): Promise<Array<IMOSRunningOrderBase>> { return mosDevice.getAllRunningOrders() }
			f = function (cb: (story: IMOSROFullStory) => Promise<IMOSROAck>): void { return mosDevice.onROStory(cb) }
			f = function (story: IMOSROFullStory): Promise<IMOSROAck> { return mosDevice.sendROStory(story) }
		}
	}
})

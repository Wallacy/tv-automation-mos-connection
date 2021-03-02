import { IProfiles } from './config/connectionConfig'
import { MosTime } from './dataTypes/mosTime'
import { MosDuration as MosDurationDataType } from './dataTypes/mosDuration'
import { MosString128 } from './dataTypes/mosString128'
import { IMOSExternalMetaData } from './dataTypes/mosExternalMetaData'
import { IMOSListMachInfo, MosItemReplaceOptions, RoReqStoryActionOptions } from './mosModel'
import { MosDevice } from './MosDevice'

// import {IMOSListMachInfo as IMOSP0ListMachineInfo, IMOSListMachInfo} from "./mosModel/0_listMachInfo"
// import {HeartBeat} from './mosModel/0_heartBeat';

// /** */
// // export interface IMOSDeviceConnectionOptions {
// // 	primary: {
// // 		id: string, // ncsID or mosID ("WINSERVERSOMETHINGENPS")
// // 		host: string, // ip-address
// // 		ports?: {
// // 			upper?: number,
// // 			lower?: number,
// // 			query?: number
// // 		}
// // 	},
// // 	buddy?: {
// // 		id: string, // ncsID or mosID ("WINSERVERSOMETHINGENPS")
// // 		host: string, // ip-address
// // 		ports?: {
// // 			upper?: number,
// // 			lower?: number,
// // 			query?: number
// // 		}
// // 	}
// // }

// /** */
// export interface IMOSDevice {
// 	id:string, // unique id for this device and instance (randomized upon init?)
// 	connectionOptions: IMOSDeviceConnectionOptions,

// 	// events
// 	onConnectionChange:(cb:(connected:string) => void) => void
// }

// /** */
// export interface IMOSDeviceP0 extends IMOSDevice {
// 	// messages
// 	getMachineInfo:() => Promise<IMOSListMachInfo>
// 	heartBeat:() => Promise<HeartBeat>
// }

export interface IMosConnection {
	readonly isListening: boolean

	readonly acceptsConnections: boolean
	readonly profiles: IProfiles
	readonly isCompliant: boolean
	readonly complianceText: string

	dispose: () => Promise<void>
	/*  */
	connect: (connectionOptions: IMOSDeviceConnectionOptions) => Promise<MosDevice> // resolved when connection has been made (before .onConnection is fired)
	onConnection: (cb: (mosDevice: MosDevice) => void) => void

	on (event: 'error', listener: (error: Error) => void): this
	on (event: 'info', listener: (message: string, data?: any) => void): this
	on (event: 'rawMessage', listener: (source: string, type: string, message: string) => void): this
}

export interface IMOSDevice {
	idPrimary: string, // unique id for this device and session
	idSecondary: string | null, // unique id for this device and session (buddy)
	/* Profile 0 */
	/*  */
	getMachineInfo: () => Promise<IMOSListMachInfo>
	onGetMachineInfo: (cb: () => Promise<IMOSListMachInfo>) => void
	/* Emitted when the connection status has changed */
	onConnectionChange: (cb: (connectionStatus: IMOSConnectionStatus) => void) => void
	getConnectionStatus: () => IMOSConnectionStatus

	/* Profile 1 */
	/**
	 * Contains information that describes a unique MOS Object to the NCS.
	 * The NCS uses this information to search for and reference the MOS Object.
	 * http://mosprotocol.com/wp-content/MOS-Protocol-Documents/MOS-Protocol-2.8.4-Current.htm#mosObj
	 */
	sendMOSObject (obj: IMOSObject): Promise<IMOSAck>
	/**
	 * Request from the NCS for a description of an Object.
	 * http://mosprotocol.com/wp-content/MOS-Protocol-Documents/MOS-Protocol-2.8.4-Current.htm#mosReqObj
	 */
	onRequestMOSObject: (cb: (objId: string) => Promise<IMOSObject | null>) => void
	/**
	 * Message used by the NCS to request the description of an object.
	 * http://mosprotocol.com/wp-content/MOS-Protocol-Documents/MOS-Protocol-2.8.4-Current.htm#mosReqObj
	 */
	getMOSObject: (objId: MosString128) => Promise<IMOSObject>
	/**
	 * Request from the NCS for all Objects.
	 * http://mosprotocol.com/wp-content/MOS-Protocol-Documents/MOS-Protocol-2.8.4-Current.htm#mosReqAll
	 */
	onRequestAllMOSObjects: (cb: () => Promise<Array<IMOSObject>>) => void
	/**
	 * Method for the NCS to request the MOS to send it a mosObj message for every Object in the MOS.
	 * http://mosprotocol.com/wp-content/MOS-Protocol-Documents/MOS-Protocol-2.8.4-Current.htm#mosReqAll
	 */
	getAllMOSObjects: () => Promise<Array<IMOSObject>>
	/**
	 * http://mosprotocol.com/wp-content/MOS-Protocol-Documents/MOS-Protocol-2.8.4-Current.htm#mosListAll
	 * @param objs List of mosObjects to send
	 */
	sendAllMOSObjects (objs: IMOSObject[]): Promise<IMOSAck>

	// ============================================================================================
	/* Profile 2 */
	/**
	 * Message received from the NCS to the MOS that defines a new Running Order.
	 * http://mosprotocol.com/wp-content/MOS-Protocol-Documents/MOS-Protocol-2.8.4-Current.htm#roCreate
	 */
	onCreateRunningOrder: (cb: (ro: IMOSRunningOrder) => Promise<IMOSROAck>) => void
	/**
	 * Message from the NCS to the MOS that defines a new Running Order.
	 * http://mosprotocol.com/wp-content/MOS-Protocol-Documents/MOS-Protocol-2.8.4-Current.htm#roCreate
	 */
	sendCreateRunningOrder: (ro: IMOSRunningOrder) => Promise<IMOSROAck>
	/**
	 * Message received from the NCS to the MOS that defines a new Running Order, replacing an existing one.
	 * http://mosprotocol.com/wp-content/MOS-Protocol-Documents/MOS-Protocol-2.8.4-Current.htm#roReplace
	 */
	onReplaceRunningOrder: (cb: (ro: IMOSRunningOrder) => Promise<IMOSROAck>) => void
	sendReplaceRunningOrder: (ro: IMOSRunningOrder) => Promise<IMOSROAck>
	onDeleteRunningOrder: (cb: (runningOrderId: MosString128) => Promise<IMOSROAck>) => void
	sendDeleteRunningOrder: (runningOrderId: MosString128) => Promise<IMOSROAck>

	onRequestRunningOrder: (cb: (runningOrderId: MosString128) => Promise<IMOSRunningOrder | null>) => void // get roReq, send roList
	sendRequestRunningOrder: (runningOrderId: MosString128) => Promise<IMOSRunningOrder | null> // send roReq, get roList
	/** @deprecated getRunningOrder is deprecated, use sendRequestRunningOrder instead */
	getRunningOrder: (runningOrderId: MosString128) => Promise<IMOSRunningOrder | null>

	onMetadataReplace: (cb: (metadata: IMOSRunningOrderBase) => Promise<IMOSROAck>) => void
	sendMetadataReplace: (metadata: IMOSRunningOrderBase) => Promise<IMOSROAck>

	onRunningOrderStatus: (cb: (status: IMOSRunningOrderStatus) => Promise<IMOSROAck>) => void // get roElementStat
	onStoryStatus: (cb: (status: IMOSStoryStatus) => Promise<IMOSROAck>) => void // get roElementStat
	onItemStatus: (cb: (status: IMOSItemStatus) => Promise<IMOSROAck>) => void // get roElementStat

	/** @deprecated setRunningOrderStatus is deprecated, use sendRunningOrderStatus instead */
	setRunningOrderStatus: (status: IMOSRunningOrderStatus) => Promise<IMOSROAck>
	/** @deprecated setStoryStatus is deprecated, use sendStoryStatus instead */
	setStoryStatus: (status: IMOSStoryStatus) => Promise<IMOSROAck>
	/** @deprecated setItemStatus is deprecated, use sendItemStatus instead */
	setItemStatus: (status: IMOSItemStatus) => Promise<IMOSROAck>

	sendRunningOrderStatus: (status: IMOSRunningOrderStatus) => Promise<IMOSROAck> // send roElementStat
	sendStoryStatus: (status: IMOSStoryStatus) => Promise<IMOSROAck> // send roElementStat
	sendItemStatus: (status: IMOSItemStatus) => Promise<IMOSROAck> // send roElementStat

	onReadyToAir: (cb: (Action: IMOSROReadyToAir) => Promise<IMOSROAck>) => void
	sendReadyToAir: (Action: IMOSROReadyToAir) => Promise<IMOSROAck>

	onROInsertStories: (cb: (Action: IMOSStoryAction, Stories: Array<IMOSROStory>) => Promise<IMOSROAck>) => void
	sendROInsertStories: (Action: IMOSStoryAction, Stories: Array<IMOSROStory>) => Promise<IMOSROAck>
	onROInsertItems: (cb: (Action: IMOSItemAction, Items: Array<IMOSItem>) => Promise<IMOSROAck>) => void
	sendROInsertItems: (Action: IMOSItemAction, Items: Array<IMOSItem>) => Promise<IMOSROAck>
	onROReplaceStories: (cb: (Action: IMOSStoryAction, Stories: Array<IMOSROStory>) => Promise<IMOSROAck>) => void
	sendROReplaceStories: (Action: IMOSStoryAction, Stories: Array<IMOSROStory>) => Promise<IMOSROAck>
	onROReplaceItems: (cb: (Action: IMOSItemAction, Items: Array<IMOSItem>) => Promise<IMOSROAck>) => void
	sendROReplaceItems: (Action: IMOSItemAction, Items: Array<IMOSItem>) => Promise<IMOSROAck>
	onROMoveStories: (cb: (Action: IMOSStoryAction, Stories: Array<MosString128>) => Promise<IMOSROAck>) => void
	sendROMoveStories: (Action: IMOSStoryAction, Stories: Array<MosString128>) => Promise<IMOSROAck>
	onROMoveItems: (cb: (Action: IMOSItemAction, Items: Array<MosString128>) => Promise<IMOSROAck>) => void
	sendROMoveItems: (Action: IMOSItemAction, Items: Array<MosString128>) => Promise<IMOSROAck>
	onRODeleteStories: (cb: (Action: IMOSROAction, Stories: Array<MosString128>) => Promise<IMOSROAck>) => void
	sendRODeleteStories: (Action: IMOSROAction, Stories: Array<MosString128>) => Promise<IMOSROAck>
	onRODeleteItems: (cb: (Action: IMOSStoryAction, Items: Array<MosString128>) => Promise<IMOSROAck>) => void
	sendRODeleteItems: (Action: IMOSStoryAction, Items: Array<MosString128>) => Promise<IMOSROAck>
	onROSwapStories: (cb: (Action: IMOSROAction, StoryID0: MosString128, StoryID1: MosString128) => Promise<IMOSROAck>) => void
	sendROSwapStories: (Action: IMOSROAction, StoryID0: MosString128, StoryID1: MosString128) => Promise<IMOSROAck>
	onROSwapItems: (cb: (Action: IMOSStoryAction, ItemID0: MosString128, ItemID1: MosString128) => Promise<IMOSROAck>) => void
	sendROSwapItems: (Action: IMOSStoryAction, ItemID0: MosString128, ItemID1: MosString128) => Promise<IMOSROAck>
	/* Profile 3 */
	onMosObjCreate: (cb: (object: IMOSObject) => Promise<IMOSAck>) => void
	mosObjCreate: (object: IMOSObject) => Promise<IMOSAck>
	onMosItemReplace: (cb: (roID: MosString128, storyID: MosString128, item: IMOSItem) => Promise<IMOSROAck>) => void
	mosItemReplace: (options: MosItemReplaceOptions) => Promise<IMOSROAck>
	onMosReqSearchableSchema: (cb: (username: string) => Promise<IMOSSearchableSchema>) => void
	mosRequestSearchableSchema: (username: string) => Promise<IMOSSearchableSchema>
	onMosReqObjectList: (cb: (objList: IMosRequestObjectList) => Promise<IMosObjectList>) => void
	mosRequestObjectList: (reqObjList: IMosRequestObjectList) => Promise<IMosObjectList>
	onMosReqObjectAction: (cb: (action: string, obj: IMOSObject) => Promise<IMOSAck>) => void
	/* Profile 4 */
	onROReqAll: (cb: () => Promise<IMOSRunningOrder[]>) => void
	getAllRunningOrders: () => Promise<Array<IMOSRunningOrderBase>> // send roReqAll
	onROStory: (cb: (story: IMOSROFullStory) => Promise<IMOSROAck>) => void // roStorySend
	sendROStory: (story: IMOSROFullStory) => Promise<IMOSROAck>// roStorySend
}
export { IMOSListMachInfo }
export interface IMOSROAction {
	RunningOrderID: MosString128
}
export interface IMOSStoryAction extends IMOSROAction {
	StoryID: MosString128
}
export interface IMOSItemAction extends IMOSStoryAction {
	ItemID: MosString128
}
export interface IMOSROReadyToAir {
	ID: MosString128
	Status: IMOSObjectAirStatus
}
export interface IMOSRunningOrderStatus {
	ID: MosString128
	Status: IMOSObjectStatus
	Time: MosTime
}
export interface IMOSStoryStatus {
	RunningOrderId: MosString128
	ID: MosString128
	Status: IMOSObjectStatus
	Time: MosTime
}
export interface IMOSItemStatus {
	RunningOrderId: MosString128
	StoryId: MosString128
	ID: MosString128
	Status: IMOSObjectStatus
	Time: MosTime
	ObjectId?: MosString128
	Channel?: MosString128
}
export interface IMOSRunningOrderBase {
	ID: MosString128 // running order id
	Slug: MosString128
	DefaultChannel?: MosString128
	EditorialStart?: MosTime
	EditorialDuration?: MosDuration
	Trigger?: MosString128 // TODO: Johan frågar vad denna gör
	MacroIn?: MosString128
	MacroOut?: MosString128
	MosExternalMetaData?: Array<IMOSExternalMetaData>
}
export interface IMOSRunningOrder extends IMOSRunningOrderBase {
	Stories: Array<IMOSROStory>
}
export interface IMOSStory {
	ID: MosString128
	Slug?: MosString128
	Number?: MosString128
	MosExternalMetaData?: Array<IMOSExternalMetaData>
}
export interface IMOSROStory extends IMOSStory {
	Items: Array<IMOSItem>
}
export interface IMOSROFullStory extends IMOSStory {
	RunningOrderId: MosString128
	Body: Array<IMOSROFullStoryBodyItem>
}
export interface IMOSROFullStoryBodyItem {
	Type: string // enum, whatever?
	Content: IMOSItem | string
}
export interface IMOSItem {
	ID: MosString128
	Slug?: MosString128
	ObjectSlug?: MosString128
	ObjectID: MosString128
	MOSID: string
	mosAbstract?: string
	Paths?: Array<IMOSObjectPath>
	Channel?: MosString128
	EditorialStart?: number
	EditorialDuration?: number
	Duration?: number
	TimeBase?: number
	UserTimingDuration?: number
	Trigger?: any // TODO: Johan frågar
	MacroIn?: MosString128
	MacroOut?: MosString128
	MosExternalMetaData?: Array<IMOSExternalMetaData>
	MosObjects?: Array<IMOSObject>
}

export type MosDuration = MosDurationDataType // HH:MM:SS

export interface IMOSAck {
	ID: MosString128
	Revision: number // max 999
	Status: IMOSAckStatus
	Description: MosString128
}

export interface IMOSROAck {
	ID: MosString128 // Running order id
	Status: MosString128 // OK or error desc
	Stories: Array<IMOSROAckStory>
}

export interface IMOSROAckStory {
	ID: MosString128 // storyID
	Items: Array<IMOSROAckItem>
}

export interface IMOSROAckItem {
	ID: MosString128
	Channel: MosString128
	Objects: Array<IMOSROAckObject>
}

export interface IMOSROAckObject {
	Status: IMOSObjectStatus
}

// /** */
// export type IPAddress = string;

// /** */
export interface IMOSConnectionStatus {
	PrimaryConnected: boolean
	PrimaryStatus: string // if not connected this will contain human-readable error-message
	SecondaryConnected: boolean
	SecondaryStatus: string // if not connected this will contain human-readable error-message
}

export interface IMOSDeviceConnectionOptions {
	/** Connection options for the Primary NCS-server */
	primary: {
		/** Name (NCS ID) of the NCS-server */
		id: string
		/** Host address (IP-address) of the NCS-server  */
		host: string // ip-addr
		/** (Optional): Custom ports for communication */
		ports?: {
			upper: number
			lower: number
			query: number
		}
		/** (Optional) Timeout for commands (ms) */
		timeout?: number
		/** (Optional) Some server doesn't expose the Query port, which can cause connection-errors.
		 * Set this to true to not use that port (will cause some methods to stop working)
		 */
		dontUseQueryPort?: boolean
	}
	/** Connection options for the Secondary (Buddy) NCS-server */
	secondary?: {
		/** Name (NCS ID) of the Buddy NCS-server */
		id: string
		/** Host address (IP-address) of the NCS-server  */
		host: string
		/** (Optional): Custom ports for communication */
		ports?: {
			upper: number
			lower: number
			query: number
		}
		/** (Optional) Timeout for commands (ms) */
		timeout?: number

		/** (Optional) Some server doesn't expose the Query port, which can cause connection-errors.
		 * Set this to true to not use that port (will cause some methods to stop working)
		 */
		dontUseQueryPort?: boolean
	}
}

export interface IMOSObject {
	ID?: MosString128
	Slug: MosString128
	MosAbstract?: string
	Group?: string
	Type: IMOSObjectType
	TimeBase: number
	Revision?: number // max 999
	Duration: number
	Status?: IMOSObjectStatus
	AirStatus?: IMOSObjectAirStatus
	Paths?: Array<IMOSObjectPath>
	CreatedBy?: MosString128
	Created?: MosTime
	ChangedBy?: MosString128 // if not present, defaults to CreatedBy
	Changed?: MosTime // if not present, defaults to Created
	Description?: any // xml json
	MosExternalMetaData?: Array<IMOSExternalMetaData>
	MosItemEditorProgID?: MosString128
}

export interface IMosObjectList {
	username: string
	queryID: string
	listReturnStart: number
	listReturnEnd: number
	listReturnTotal: number
	listReturnStatus?: string
	list?: Array<IMOSObject>
}

export interface IMosRequestObjectList {
	username: string
	queryID: MosString128
	listReturnStart: number | null
	listReturnEnd: number | null
	generalSearch: MosString128
	mosSchema: string
	searchGroups: Array<{
		searchFields: Array<IMosSearchField>
	}>
}

export interface IMosSearchField {
	XPath: string
	sortByOrder?: number
	sortType?: string
}

export interface IMOSSearchableSchema {
	username: string
	mosSchema: string
}

export enum IMOSObjectType {
	STILL = 'STILL',
	AUDIO = 'AUDIO',
	VIDEO = 'VIDEO',
	OTHER = 'OTHER' // unknown/not speficied
}

export enum IMOSObjectStatus {
	NEW = 'NEW',
	UPDATED = 'UPDATED',
	MOVED = 'MOVED',
	BUSY = 'BUSY',
	DELETED = 'DELETED',
	NCS_CTRL = 'NCS CTRL',
	MANUAL_CTRL = 'MANUAL CTRL',
	READY = 'READY',
	NOT_READY = 'NOT READY',
	PLAY = 'PLAY',
	STOP = 'STOP'
}

export enum IMOSAckStatus {
	ACK = 'ACK',
	NACK = 'NACK'
}

export enum IMOSObjectAirStatus {
	READY = 'READY',
	NOT_READY = 'NOT READY'
}

export interface IMOSObjectPath {
	Type: IMOSObjectPathType
	Description: string
	Target: string // Max 255
}

export enum IMOSObjectPathType {
	PATH = 'PATH',
	PROXY_PATH = 'PROXY PATH',
	METADATA_PATH = 'METADATA PATH'
}
export { IMOSExternalMetaData, RoReqStoryActionOptions }

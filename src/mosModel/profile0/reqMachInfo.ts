import * as XMLBuilder from 'xmlbuilder'
import { MosMessage } from '../MosMessage'

export class ReqMachInfo extends MosMessage {

  /** */
	constructor () {
		super('lower')
	}

  /** */
	get messageXMLBlocks (): XMLBuilder.XMLElement {
		let messageBlock = XMLBuilder.create('reqMachInfo')
		return messageBlock
	}
}

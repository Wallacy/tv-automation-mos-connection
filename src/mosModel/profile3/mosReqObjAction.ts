import { IMOSObject } from '../../api'
import { MosMessage } from '../MosMessage'
import * as XMLBuilder from 'xmlbuilder'
import { XMLMosObject } from '../profile1/xmlConversion'

export interface MosReqObjActionOptions {
	object: IMOSObject
	action: 'NEW' | 'UPDATE' | 'DELETE'
}

export class MosReqObjAction extends MosMessage {
	private options: MosReqObjActionOptions

	constructor (options: MosReqObjActionOptions) {
		super('lower')
		this.options = options
	}

	get messageXMLBlocks (): XMLBuilder.XMLElement {
		const xml = XMLBuilder.create('mosReqObjAction')
		xml.att('operation', this.options.action)
		if (this.options.action !== 'NEW') xml.att('objID', this.options.object.ID)

		XMLMosObject.toXML(xml, this.options.object)

		return xml
	}
}

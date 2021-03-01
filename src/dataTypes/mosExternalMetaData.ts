import * as XMLBuilder from 'xmlbuilder'
import { addTextElement } from '..//utils/Utils'

export interface IMOSExternalMetaData {
	MosScope?: IMOSScope
	MosSchema: string
	MosPayload: any
}

export enum IMOSScope {
	OBJECT = 'OBJECT',
	STORY = 'STORY',
	PLAYLIST = 'PLAYLIST'
}

export class MosExternalMetaData {
	private _scope?: IMOSScope
	private _schema: string
	private _payload: any

	constructor (obj: IMOSExternalMetaData) {
		this._scope = obj.MosScope
		this._schema = `${obj.MosSchema}`
		this._payload = obj.MosPayload
	}

	get scope (): IMOSScope | undefined {
		return this._scope
	}

	get schema (): string {
		return this._schema
	}

	get payload (): any {
		return this._payload
	}

	get messageXMLBlocks (): XMLBuilder.XMLElement {
		const { create } = XMLBuilder
		const root = create('mosExternalMetadata') // config headless

		addTextElement(root, 'mosScope', {}, this._scope)
		addTextElement(root, 'mosSchema', {}, this._schema)
		const payloadElem = create({ ['mosPayload']: this._payload })

		root.importDocument(payloadElem)
		return root
	}
}

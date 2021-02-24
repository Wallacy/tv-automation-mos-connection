
import * as XMLBuilder from 'xmlbuilder'
import { IMOSROStory, MosDuration } from '../../api'
import { MosMessage } from '../MosMessage'
import { MosString128 } from '../../dataTypes/mosString128'
import { addTextElement } from '../../utils/Utils'
import { Parser } from '../Parser'

interface BaseOptions {
	roID: MosString128
	leaseLock: MosDuration
	username: MosString128
}

interface RoReqStoryNew extends BaseOptions {
	action: 'NEW'
	story: IMOSROStory
	targetID: MosString128
}

interface RoReqStoryUpdate extends BaseOptions {
	action: 'UPDATE'
	story: IMOSROStory
}

interface RoReqStoryDelete extends BaseOptions {
	action: 'DELETE'
	storyID: MosString128
}

interface RoReqStoryMove extends BaseOptions {
	action: 'MOVE'
	storyID: MosString128
	targetID: MosString128
}

export type RoReqStoryActionOptions = RoReqStoryNew | RoReqStoryUpdate | RoReqStoryDelete | RoReqStoryMove

export class RoReqStoryAction extends MosMessage {
	private options: RoReqStoryActionOptions
	/** */
	constructor (options: RoReqStoryActionOptions) {
		super()
		this.options = options
		this.port = 'upper'
	}

	/** */
	get messageXMLBlocks (): XMLBuilder.XMLElement {
		const xml = XMLBuilder.create('mosReqObjAction')
		const xmlStorySend = XMLBuilder.create('roStorySend')

		xml.att('operation', this.options.action)
		xml.att('leaseLock', this.options.leaseLock)
		xml.att('username', this.options.username)

		switch (this.options.action) {
			case 'NEW': {
				const { roID, story, targetID } = this.options

				const source = XMLBuilder.create('element_source')
				const target = XMLBuilder.create('element_target')

				addTextElement(xmlStorySend, 'roID', {}, roID)
				addTextElement(target, 'storyID', {}, targetID)

				const storyXml = XMLBuilder.create('story')
				Parser.attachMOSROStory2xml(story, storyXml)

				source.importDocument(storyXml)
				break
			}

			case 'UPDATE': {
				const { roID, story } = this.options

				addTextElement(xmlStorySend, 'roID', {}, roID)
				Parser.attachMOSROStory2xml(story, xmlStorySend)
				break
			}

			case 'MOVE': {
				const { roID, storyID, targetID } = this.options

				const source = XMLBuilder.create('element_source')
				const target = XMLBuilder.create('element_target')

				addTextElement(xmlStorySend, 'roID', {}, roID)
				addTextElement(source, 'storyID', {}, storyID)
				addTextElement(target, 'storyID', {}, targetID)
				break
			}

			case 'DELETE': {
				const { roID, storyID } = this.options

				addTextElement(xmlStorySend, 'roID', {}, roID)
				addTextElement(xmlStorySend, 'storyID', {}, storyID)
				addTextElement(xmlStorySend, 'storyBody', {})
				break
			}

			default:
				break
		}

		xml.importDocument(xmlStorySend)

		return xml
	}
}


import * as XMLBuilder from 'xmlbuilder'
import { IMOSItem, IMOSROStory, MosDuration } from '../../api'
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
	story?: IMOSROStory
	item?: IMOSItem
	targetStoryID?: MosString128
	targetItemID?: MosString128
}

interface RoReqStoryUpdate extends BaseOptions {
	action: 'UPDATE'
	story?: IMOSROStory
	storyID?: MosString128
	item?: IMOSItem
}

interface RoReqStoryDelete extends BaseOptions {
	action: 'DELETE'
	storyID: MosString128
	itemID?: MosString128
}

interface RoReqStoryMove extends BaseOptions {
	action: 'MOVE'
	storyID: MosString128
	itemID?: MosString128
	targetStoryID?: MosString128
	targetItemID?: MosString128
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
		const xml = XMLBuilder.create('roReqStoryAction')
		const xmlStorySend = XMLBuilder.create('roStorySend')
		const target = XMLBuilder.create('element_target')
		const source = XMLBuilder.create('element_source')

		xml.att('operation', this.options.action)
		xml.att('leaseLock', this.options.leaseLock)
		xml.att('username', this.options.username)

		addTextElement(xmlStorySend, 'roID', {}, this.options.roID)

		switch (this.options.action) {
			case 'NEW': {
				const { story, item, targetStoryID, targetItemID } = this.options

				if (item) {
					const itemElem = Parser.item2xml(item)
					source.importDocument(itemElem)

					targetStoryID && addTextElement(target, 'storyID', {}, targetStoryID)
					targetItemID && addTextElement(target, 'itemID', {}, targetItemID)
				} else if (story) {
					const storyElem = Parser.story2xml(story)
					source.importDocument(storyElem)

					targetStoryID && addTextElement(target, 'storyID', {}, targetStoryID)
				}

				break
			}
			case 'UPDATE': {
				const { story, storyID, item } = this.options

				// ADD Story
				if (story) {
					addTextElement(target, 'storyID', {}, storyID || story.ID)
					const storyElem = Parser.story2xml(story)
					source.importDocument(storyElem)
				}

				// ADD Item
				if (storyID && item) {
					addTextElement(target, 'storyID', {}, storyID)
					addTextElement(target, 'itemID', {}, item.ID)
					const itemElem = Parser.item2xml(item)
					source.importDocument(itemElem)
				}

				xmlStorySend.importDocument(target)
				break
			}

			case 'MOVE': {
				const { storyID, itemID, targetItemID, targetStoryID } = this.options

				if (itemID) {
					addTextElement(source, 'storyID', {}, storyID)
					addTextElement(source, 'itemID', {}, itemID)
					targetStoryID && addTextElement(target, 'storyID', {}, targetStoryID)
					targetItemID && addTextElement(target, 'itemID', {}, targetItemID)
				} else {
					addTextElement(source, 'storyID', {}, storyID)
					targetStoryID && addTextElement(target, 'storyID', {}, targetStoryID)
				}

				break
			}

			case 'DELETE': {
				const { storyID, itemID } = this.options

				addTextElement(xmlStorySend, 'storyID', {}, storyID)

				if (itemID) {
					addTextElement(target, 'storyID', {}, storyID)
					addTextElement(source, 'itemID', {}, itemID)
					xmlStorySend.importDocument(source)
				} else {
					addTextElement(source, 'storyID', {}, storyID)
				}
				break
			}

			default:
				break
		}

		xmlStorySend.importDocument(source)
		xmlStorySend.importDocument(target)
		xml.importDocument(xmlStorySend)

		return xml
	}
}

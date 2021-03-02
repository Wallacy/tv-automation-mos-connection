import { IMOSROFullStoryBodyItem, IMOSROFullStory } from '../../api'
import { XMLROStory, XMLMosItem } from '../profile2/xmlConversion'
import { MosString128 } from '../../dataTypes/mosString128'

export namespace XMLROFullStory {
	export function fromXML (xml: any): IMOSROFullStory {
		let story0 = XMLROStory.fromXML(xml)
		let story: IMOSROFullStory = {
			ID: story0.ID,
			Slug: story0.Slug,
			Number: story0.Number,
			MosExternalMetaData: story0.MosExternalMetaData,
			RunningOrderId: new MosString128(xml.roID),
			Body: fromXMLStoryBody(xml.storyBody)
		}

		return story
	}
	function fromXMLStoryBody (xml: any): IMOSROFullStoryBodyItem[] {
		let body: IMOSROFullStoryBodyItem[] = []

		/*
		// Not able to implement this currently, need to change {arrayNotation: true} in xml2json option
		let elementKeys = Object.keys(xml)
		elementKeys.forEach((key: string) => {
			// let elements
			let d = xml[key]

			if (!Array.isArray(d)) d = [d]

			d.forEach((el: any) => {
				let bodyItem: IMOSROFullStoryBodyItem = {
					Type: key,
					Content: el
				}
				body.push(bodyItem)
			})
		})
		console.log('xml2Body', body)
		*/
		if (xml.elements && Array.isArray(xml.elements)) {
			for (const item of xml.elements) {
				let bodyItem: IMOSROFullStoryBodyItem = {
					Type: item.$name || item.$type,
					Content: item
				}
				if (item.$name === 'storyItem') {
					bodyItem.Content = XMLMosItem.fromXML(item)
				}
				body.push(bodyItem)
			}
		}
		// Temporary implementation:
		if (xml.storyItem) {
			let items: Array<any> = xml.storyItem
			if (!Array.isArray(items)) items = [items]
			items.forEach((item) => {
				let bodyItem: IMOSROFullStoryBodyItem = {
					Type: 'storyItem',
					Content: XMLMosItem.fromXML(item)
				}
				body.push(bodyItem)
			})
		}
		return body
	}
}

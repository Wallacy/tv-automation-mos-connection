import * as XMLBuilder from 'xmlbuilder'
import { IMosRequestObjectList, IMOSObject, IMOSAck } from '../../api'
import { MosString128 } from '../../dataTypes/mosString128'
import { MosTime } from '../../dataTypes/mosTime'
import { XMLObjectPaths, XMLMosExternalMetaData } from '../profile2/xmlConversion'
import { addTextElement } from '../../utils/Utils'

export namespace XMLMosAck {
	export function fromXML (xml: any): IMOSAck {
		let ack: IMOSAck = {
			ID: new MosString128(xml.objID),
			Revision: typeof xml.objRev === 'number' ? xml.objRev : 0,
			Status: typeof xml.status === 'string' ? xml.status : 'ACK',
			Description: new MosString128(typeof xml.statusDescription === 'string' ? xml.statusDescription : '')
		}
		return ack
	}
}
export namespace XMLMosObjects {
	export function fromXML (xml: any): Array<IMOSObject> {
		if (!xml) return []
		let xmlObjs: Array<any> = []
		xmlObjs = xml
		if (!Array.isArray(xmlObjs)) xmlObjs = [xmlObjs]

		return xmlObjs.map((xmlObj) => {
			return XMLMosObject.fromXML(xmlObj)
		})
	}
	export function toXML (xml: XMLBuilder.XMLElement, objs?: IMOSObject[]) {
		if (objs) {
			objs.forEach(MosObject => {
				let xmlMosObj = XMLBuilder.create('mosObj')
				XMLMosObject.toXML(xmlMosObj, MosObject)
				xml.importDocument(xmlMosObj)
			})
		}
	}
}
export namespace XMLMosObject {
	export function fromXML (xml: any): IMOSObject {
		let mosObj: IMOSObject = {
			ID: new MosString128(xml.objID),
			Slug: new MosString128(xml.objSlug),
			MosAbstract: xml.mosAbstract,
			Group: xml.objGroup,
			Type: xml.objType,
			TimeBase: xml.objTB,
			Revision: xml.objRev,
			Duration: xml.objDur,
			Status: xml.status,
			AirStatus: xml.objAir,
			Paths: XMLObjectPaths.fromXML(xml.objPaths),
			CreatedBy: new MosString128(xml.createdBy),
			Created: new MosTime(xml.created),
			ChangedBy: new MosString128(xml.changedBy),
			Changed: new MosTime(xml.changed),
			Description: xml.description
		}
		if (xml.hasOwnProperty('mosExternalMetadata')) mosObj.MosExternalMetaData = XMLMosExternalMetaData.fromXML(xml.mosExternalMetadata)
		if (xml.hasOwnProperty('mosItemEditorProgID')) mosObj.MosItemEditorProgID = new MosString128(xml.mosItemEditorProgID)
		return mosObj
	}
	export function toXML (xml: XMLBuilder.XMLElement, obj: IMOSObject): void {
		if (obj.ID) addTextElement(xml, 'objID', obj.ID)
		addTextElement(xml, 'objSlug', obj.Slug)
		if (obj.MosAbstract) 	addTextElement(xml, 'mosAbstract', obj.MosAbstract)
		if (obj.Group) 			addTextElement(xml, 'objGroup', obj.Group)
		addTextElement(xml, 'objType', obj.Type)
		addTextElement(xml, 'objTB', obj.TimeBase)
		addTextElement(xml, 'objRev', obj.Revision)
		addTextElement(xml, 'objDur', obj.Duration)
		addTextElement(xml, 'status', obj.Status)
		addTextElement(xml, 'objAir', obj.AirStatus)

		if (obj.Paths) {
			XMLObjectPaths.toXML(xml, obj.Paths)
		}

		addTextElement(xml, 'createdBy', obj.CreatedBy)
		addTextElement(xml, 'created', obj.Created)
		if (obj.ChangedBy) addTextElement(xml, 'changedBy', obj.ChangedBy)
		if (obj.Changed) addTextElement(xml, 'changed', obj.Changed)
		if (obj.Description) addTextElement(xml, 'description', obj.Description)
		XMLMosExternalMetaData.toXML(xml, obj.MosExternalMetaData)
	}
}
export namespace XMLMosRequestObjectList {
	export function fromXML (xml: any): IMosRequestObjectList {
		const list: IMosRequestObjectList = {
			username: xml.username,
			queryID: xml.queryID,
			listReturnStart: xml.listReturnStart,
			listReturnEnd: xml.listReturnEnd,
			generalSearch: xml.generalSearch,
			mosSchema: xml.mosSchema,
			searchGroups: []
		}

		if (typeof list.listReturnStart === 'object') list.listReturnStart = null
		if (typeof list.listReturnEnd === 'object') list.listReturnEnd = null

		for (const searchGroup of xml.searchGroup) {
			const i = list.searchGroups.push({ searchFields: searchGroup.searchField })

			for (const searchField of list.searchGroups[i - 1].searchFields) {
				if (searchField.sortByOrder) searchField.sortByOrder = parseInt(searchField.sortByOrder + '', 10)
			}
		}

		return list
	}
}

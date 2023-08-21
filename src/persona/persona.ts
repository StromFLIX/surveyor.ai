import germany from '../../data/deu.json' assert { type: "json" };

export interface Persona {
    age: string,
    citizenship: string,
    sex: string,
    ethnicity: string,
    "net-income": string,
    residency: string,
    education: string,
    religion: string,
    occupation: string,
    "martial-status": string
}

type DemographicDataDimension = Record<string, number>

interface DemographicData {
    age: DemographicDataDimension,
    citizenship: DemographicDataDimension,
    sex: DemographicDataDimension,
    ethnicity: DemographicDataDimension,
    "net-income": DemographicDataDimension,
    residency: DemographicDataDimension,
    education: DemographicDataDimension,
    religion: DemographicDataDimension,
    occupation: DemographicDataDimension,
    "martial-status": DemographicDataDimension
}

export function getPersona(): Persona {
    const germanyDemographicData = readDemographicData(DemographicDataRegion.Germany)
    return collapseDemographicDataDistribution(germanyDemographicData)
}

enum DemographicDataRegion {
    Germany = "germany"
}

function collapseDemographicDataDistribution(demographicData: DemographicData) : Persona {
    const collapsedPersonaGroup : Persona = {
        age: "N/A",
        citizenship: "N/A",
        sex: "N/A",
        education: "N/A",
        ethnicity: "N/A",
        "net-income": "N/A",
        residency: "N/A",
        occupation: "N/A",
        religion: "N/A",
        "martial-status": "N/A"
    }
    for (const demographicDataDimension of Object.keys(demographicData) as Array<keyof typeof demographicData>) {
        const demographicDataDimensionDistribution = demographicData[demographicDataDimension]
        const random = Math.random()
        let currentMax = 0, currentMin = 0
        for (const [key, value] of Object.entries(demographicDataDimensionDistribution)){
            currentMax += value
            if(random >= currentMin && random < currentMax){
                collapsedPersonaGroup[demographicDataDimension] = key
            }
            currentMin += value
        }
    }
    return collapsedPersonaGroup
}

function readDemographicData(demographicDataRegion: DemographicDataRegion) : DemographicData {
    return germany as DemographicData
}
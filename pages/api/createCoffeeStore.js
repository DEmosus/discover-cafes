import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";


const createCoffeeStore = async (req, res) => {
    if (req.method === "POST") {

        const { id, name, address, locality, imgUrl, voting } = req.body;
        try {
            // find a record
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !==0) {
                    res.json(records);
                } else {
                    // create a record
                    if(name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    locality,
                                    voting,
                                    imgUrl
                                }
                            }
                        ])
                        const records = getMinifiedRecords(createRecords)
                        res.json(records);
                    } else {
                        res.status(400);
                        res.json({message: "Id or name is missing"})
                    }
                }
            } else {
                res.status(400);
                res.json({message: "Id is missing"})
            }
            
        } catch (err) {
            console.error("Error creating or finding a store1", err);
            res.status(500);
            res.json({message: "Error creating or finding a store", err})
        }
    }
}

export default createCoffeeStore;
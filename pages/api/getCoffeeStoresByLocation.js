import { fetchCoffeeStores } from "@/lib/coffee-store";

const getCoffeeStoresByLocation = async (req, res) => {
    try{
        const {latLong, limit } = req.query;
        const response = await fetchCoffeeStores(latLong, limit);
        res.status(200);
        res.json(response);
    } catch (err) {
        console.error("There is an Error", err)
        res.status(500);
        res.json({ message: "Opps! Something went wrong", err})
    }
}

export default getCoffeeStoresByLocation;
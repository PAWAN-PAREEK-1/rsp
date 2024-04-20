import Order from "../models/order.models.js";

export const createOrder = async (req, res) => {
    try {
        const { customerDetails, items } = req.body;
        const data = {
            orderId: customerDetails.phone,
            customerDetails,
            items
        }

        const order = await Order.create(data);

        if(!order) {
            return res.status(400)
            .json({
                success: false,
                message: 'Order placed failed please try again.'
            })
        }

        
        

        await order.save();

        res.status(201)
        .json({
            success: true,
            data: order
        })
        
    } catch (error) {
        console.log(error)
        res.status(500)
        .json({
            success: false,
            message: error.message
        })
    }
}

export const getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200)
        .json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.log(error)
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemId, updatedStaus } = req.body;
        const order = await Order.findById(id);
        if(!order) {
            return res.status(400).json({
                success: false, message: 'Order not found'
            })
        }
        const isUpdatedSuccess = await order.updateItemOfItemsStatus(itemId, updatedStaus);

        await order.save();
        
        res.status(200).json({
            success: isUpdatedSuccess
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })        
    }
}
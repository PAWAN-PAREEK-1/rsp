import { model, Schema } from 'mongoose';
import Menu from './menu.models.js';

const orderSchema = new Schema(
    {
        orderId: {
            type: String,
            required: [true, 'orderId is required.'],
        },
        customerDetails: {
            fullName: {
                type: String,
                required: [true, 'customer name is required.'],
                minLength: 4,
            },
            phone: {
                type: String,
                required: [true, 'customer name is required.'],
                minLength: 10,
                maxlength: 14,
            }
        },
        totalPrice: {
            type: Number,
            default: 0
        },
        items: [{
            item: {
                type: Schema.Types.ObjectId,
                ref: "Menu",
            },
            quantity: {
                type: Number,
                default: 1,
            },
            status: {
                type: String,
                enum : ['COMPLETE','PENDING', 'REJECTED'],
                default: 'PENDING',            
            }
        }],
        status: {
            type: String,
            enum : ['COMPLETE','PENDING', 'REJECTED'],
            default: 'PENDING',            
        }
    },
    {
        timestamps: true,
    }
);

orderSchema.pre('save', async function(next) {
    // console.log('save')
    if (!this.isModified('items')) {
        return next();
    }
    const menus = await Menu.find({ _id: { $in: this.items.map(obj => obj.item) } }); 
    let totalAmount = 0;    
    for(let i=0; i<menus.length; i++) {
        totalAmount += this.items[i].quantity * menus[i].discountedPrice;
    }
    this.totalPrice = totalAmount;
});

orderSchema.methods = {
    updateItemOfItemsStatus: function(itemId, updatedStaus) {
        for(let i = 0; i < this.items.length; i++){
            if(this.items[i].item.toString() === itemId){
                this.items[i].status = updatedStaus;
                this.updateStatus()
                return true;
            }           
        }
        return false;
    },
    updateStatus: function() {
        for(let i = 0; i < this.items.length; i++){
            if(this.items[i].status !== 'COMPLETE'){
                break;
            }           
        }
        this.status = 'COMPLETE'        
    }
}

const Order = model("Order", orderSchema);

export default Order;
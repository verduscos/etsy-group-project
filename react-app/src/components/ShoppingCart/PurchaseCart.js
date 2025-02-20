import { FaCcMastercard } from 'react-icons/fa';
import { FaCcVisa } from 'react-icons/fa';
import { SiAmericanexpress } from 'react-icons/si';
import { FaCcPaypal } from 'react-icons/fa';
import { SiKlarna } from 'react-icons/si';
import { FaCcDiscover } from 'react-icons/fa';
import Button from '../common/Button/Button';
import { deleteCartItems } from '../../store/shoppingCart';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const PurchaseCart = ({ cartItems, setWasPurchased, setShoppingCartErrors }) => {
  const dispatch = useDispatch();
  let shoppingCart = useSelector((state) => state.shoppingCart);
  let itemsInCart = Object.values(shoppingCart)
  const [totalPriceItems, setTotalPriceItems] = useState(0)
  let totalPrice = 0;


  for (let i = 0; i < itemsInCart.length; i++) {
    totalPrice =
      totalPrice +
      parseFloat(+itemsInCart[i].product_price * itemsInCart[i].quantity);
  }







  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  /*
    onClick of pruchase button I dispatch a thunk that clears all items in cart only if
    the quantity for the item is still available and the item is still being sold.

    */


  const handleClick = () => {
    const postRequest = async () => {
      const response = await fetch(`/api/purchases/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchases: cartItems }),
      });

      const data = await response.json();

      if (data && data.errors) {
        setShoppingCartErrors([data.errors[0], data.errors[1]])
      } else {
        let cartItemIds = [];

        for (let i = 0; i < cartItems.length; i++) {
          cartItemIds.push(cartItems[i].id);
        }
        dispatch(deleteCartItems(cartItemIds));

        setWasPurchased(true);
        setShoppingCartErrors(false)
      }
    };

    postRequest();
  };


  return (
    <>

      <div className="cartPurchaseContainer">
        <div className="paymentMethodContainer">
          <p className="howYouPayText"> How you'll Pay</p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '10px',
              alignItems: 'center',
            }}
          >
            <input
              className="paymentInput"
              type="radio"
              value="Male"
              name="gender"
              defaultChecked
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '10px',
              }}
            >
              <FaCcMastercard style={{ fontSize: '40px', marginRight: '10px' }} />
              <FaCcVisa style={{ fontSize: '40px', marginRight: '10px' }} />
              <SiAmericanexpress
                style={{
                  color: '#2671B9',
                  fontSize: '35px',
                  marginRight: '10px',
                  height: '32px',
                  marginTop: '4px',
                  borderRadius: '2px',
                }}
              />
              <FaCcDiscover
                style={{
                  color: '#F58220',
                  fontSize: '40px',
                  marginRight: '10px',
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '10px',
              alignItems: 'center',
            }}
          >
            <input
              className="paymentInput"
              type="radio"
              value="Female"
              name="gender"
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '10px',
              }}
            >
              <FaCcPaypal
                style={{
                  fontSize: '40px',
                  marginRight: '10px',
                  color: '#0079C1',
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '10px',
              alignItems: 'center',
            }}
          >
            <input
              className="paymentInput"
              type="radio"
              value="Other"
              name="gender"
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '10px',
              }}
            >
              <SiKlarna
                style={{ fontSize: '30px', marginRight: '10px', color: 'pink' }}
              />
            </div>
          </div>
        </div>
        <div className="cartPriceContainer">
          <div className="cartPriceTotal">
            <div>Item(s) total:</div>
            <div id="totalPriceText">{`${formatter.format(totalPrice)}`}</div>
          </div>
          <div className="shippingCostText">
            <div>Shipping:</div>
            <div className="freeText">FREE</div>
          </div>
        </div>
        <div className="purchaseButtonContainer">
          <Button
            label={'Buy it now'}
            className="purchaseCart"
            onClick={handleClick}
          />
        </div>
      </div>
    </>
  );
};

export default PurchaseCart;

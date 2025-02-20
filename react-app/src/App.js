import React, { useState, useEffect } from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductListingForm from './components/ProductListingForm';
import ProductImageForm from './components/ProductImageForm';
import ProductListingEdit from './components/ProductListingEdit';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import ProductListing from './components/ProductListing';
import PageNotFound from './components/PageNotFound';
import UserProfile from './components/UserProfile/UserProfile';
import Reviews from './components/Reviews/Reviews';
import { authenticate } from './store/session';
import SearchResult from './components/Search/SearchResult';
import CategoryView from './components/Categories';
import LandingPage from './components/LandingPage';
import DeleteWarning from './components/DeleteWarning';
import NavBar from './components/NavBar';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import FooterHome from './components/Footer/FooterHome';
import Footer from './components/Footer';
import SignInRequiredForCart from './components/ShoppingCart/signInRequiredForCart';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [shoppingCartErrors, setShoppingCartErrors] = useState(false)
  let shoppingCart = useSelector((state) => state.shoppingCart);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  let shoppingCartAndErrors = (
    <>
      <div style={{ color: "red", height: "40px", paddingTop: "30px", marginLeft: "50px" }}> {shoppingCart[`${shoppingCartErrors[0]}`]?.product_title} {shoppingCartErrors[1]}</div>
      <ShoppingCart setShoppingCartErrors={setShoppingCartErrors} />
    </>
  )

  if (!loaded) {
    return null;
  }

  return (
    <HashRouter>
      <NavBar />
      <Switch>
        <Route path="/" exact={true}>
          <LandingPage />
          <FooterHome />
        </Route>
        <Route path="/mycart" exact={true}>
          {sessionUser ? shoppingCartAndErrors : <SignInRequiredForCart />}
        </Route>
        <Route path="/category/:category" exact={true}>
          <CategoryView />
          <Footer />
        </Route>
        <Route path="/search" exact={true}>
          <SearchResult />
          <Footer />
        </Route>
        <ProtectedRoute path="/users" exact={true}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true}>
          <UserProfile />
        </ProtectedRoute>
        <Route exact path="/products/new">
          <ProductListingForm sessionUser={sessionUser} />
        </Route>
        <Route exact path="/products/:productId/edit">
          <ProductListingEdit sessionUser={sessionUser} />
          <Footer />
        </Route>
        <Route exact path="/products/:productId/images/new">
          <ProductImageForm sessionUser={sessionUser} />
        </Route>
        <Route exact path="/products/:productId">
          <ProductListing sessionId={sessionUser?.id} />
          <Reviews />
          <Footer />
        </Route>
        <Route exact path="/testing">
          <DeleteWarning />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;

from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = "users"
    if environment == "production":
      __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(1000), nullable=False)
    profile_picture_url = db.Column(
        db.Text,
        default="https://qwerty-project-bucket.s3.us-west-1.amazonaws.com/product_images/Sample_User_Icon.png",
    )
    bio = db.Column(
        db.String(2000),
        default="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    )
    rating = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)

    products = db.relationship("Product", back_populates="user")
    purchases = db.relationship("Purchase", back_populates="user")
    cart_items = db.relationship("CartItem", back_populates="user")
    reviews = db.relationship("Review", back_populates="user")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "profile_pic_url": self.profile_picture_url,
            "bio": self.bio,
            "rating": self.rating,
            "products": [product.to_dict() for product in self.products],
            "purchases": [purchase.to_dict() for purchase in self.purchases],
        }

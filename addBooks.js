const mongoose = require("mongoose");
const Book = require("./models/book");
require("dotenv").config();
require("./conn/conn");

const booksData = [
  {
    url: "https://www.amazon.in/Think-Grow-Rich-Napoleon-Hill/dp/8192910911",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 299,
    description: "A timeless classic that reveals the mindset and principles behind wealth creation and personal success. Napoleon Hill shares lessons from successful people, focusing on belief, desire, and persistence as keys to achieving goals.",
    language: "English",
    image: "https://m.media-amazon.com/images/I/71UypkUjStL._AC_UY327_FMwebp_QL65_.jpg"
  },
  {
    url: "https://www.amazon.in/Atomic-Habits-James-Clear/dp/1847941834",
    title: "Atomic Habits",
    author: "James Clear",
    price: 499,
    description: "A powerful guide to building good habits and breaking bad ones through small, consistent changes. James Clear explains how tiny improvements compound into remarkable results over time.",
    language: "English",
    image: "https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UY327_FMwebp_QL65_.jpg"
  },
  {
    url: "https://www.amazon.in/Psychology-Money-Morgan-Housel/dp/9390166268",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 399,
    description: "This book explores how people think about money, emotions that drive financial decisions, and how behavior often matters more than knowledge when it comes to building wealth.",
    language: "English",
    image: "https://m.media-amazon.com/images/I/61-hMfd7NGL._AC_UY327_FMwebp_QL65_.jpg"
  },
  {
    url: "https://www.amazon.in/Deep-Work-Focused-Success-Distracted/dp/0349413681",
    title: "Deep Work",
    author: "Cal Newport",
    price: 450,
    description: "Cal Newport shows how to focus deeply in a distracted world to produce better results in less time. The book teaches methods for improving focus, discipline, and achieving peak productivity.",
    language: "English",
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UY327_FMwebp_QL65_.jpg"
  }
];

async function addBooks() {
  try {
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    const insertedBooks = [];
    for (const bookData of booksData) {
      const existingBook = await Book.findOne({ title: bookData.title });
      
      if (!existingBook) {
        const book = new Book(bookData);
        await book.save();
        insertedBooks.push(book);
        console.log(`✅ Added: ${bookData.title}`);
      } else {
        console.log(`⏭️ Skipped (already exists): ${bookData.title}`);
      }
    }

    if (insertedBooks.length === 0) {
      console.log("\n📚 All books already exist in the database!");
    } else {
      console.log(`\n🎉 Successfully added ${insertedBooks.length} book(s) to the database!`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error adding books:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

addBooks();


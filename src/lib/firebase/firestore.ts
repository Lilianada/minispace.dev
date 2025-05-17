/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot, // Add this import
  serverTimestamp,
  Timestamp,
  setDoc,
  collectionGroup,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";

// Helper function to convert Firestore timestamps to ISO strings
const formatTimestamp = (timestamp: Timestamp | undefined) => {
  return timestamp ? timestamp.toDate().toISOString() : undefined;
};

// Helper to convert firestore documents to regular objects with id
const formatDoc = (
  doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
  userId?: string
) => {
  if (!doc.exists()) {
    return null;
  }

  const data = doc.data();
  if (!data) {
    return { id: doc.id };
  }

  // Convert all timestamp fields to ISO strings
  const formattedData: Record<string, any> = { id: doc.id };

  Object.keys(data).forEach((key) => {
    if (data[key] instanceof Timestamp) {
      formattedData[key] = formatTimestamp(data[key]);
    } else if (
      data[key] &&
      typeof data[key] === "object" &&
      !Array.isArray(data[key])
    ) {
      // Handle nested objects that might contain timestamps
      const nestedObj: Record<string, any> = {};

      Object.keys(data[key]).forEach((nestedKey) => {
        if (data[key][nestedKey] instanceof Timestamp) {
          nestedObj[nestedKey] = formatTimestamp(data[key][nestedKey]);
        } else {
          nestedObj[nestedKey] = data[key][nestedKey];
        }
      });

      formattedData[key] = nestedObj;
    } else {
      formattedData[key] = data[key];
    }
  });

  // Include userId if provided (for posts)
  if (userId) {
    formattedData.userId = userId;
  }

  return formattedData;
};

export const firestore = {
  posts: {
    // Make sure the getPosts method in firestore.ts is properly implemented

    // Get a user's posts
    getPosts: async (
      userId: string,
      { status = "all", sort = "newest" } = {}
    ) => {
      try {
        console.log(
          "Firestore: Getting posts for user:",
          userId,
          "with status:",
          status,
          "sort:",
          sort
        );

        if (!userId) {
          console.error("User ID is required to fetch posts");
          throw new Error("User ID is required");
        }

        const postsRef = collection(db, `users/${userId}/posts`);
        console.log("Collection path:", `users/${userId}/posts`);

        let postsQuery = query(postsRef);

        // Filter by status
        if (status !== "all") {
          console.log("Filtering by status:", status);
          postsQuery = query(postsQuery, where("status", "==", status));
        }

        // Apply sorting
        if (sort === "newest") {
          postsQuery = query(postsQuery, orderBy("updatedAt", "desc"));
        } else if (sort === "oldest") {
          postsQuery = query(postsQuery, orderBy("updatedAt", "asc"));
        } else if (sort === "a-z") {
          postsQuery = query(postsQuery, orderBy("title", "asc"));
        } else if (sort === "z-a") {
          postsQuery = query(postsQuery, orderBy("title", "desc"));
        } else if (sort === "most-viewed") {
          postsQuery = query(postsQuery, orderBy("views", "desc"));
        }

        console.log("Executing Firestore query");
        const snapshot = await getDocs(postsQuery);
        console.log("Query results:", snapshot.docs.length, "documents");

        // Make sure formatDoc can handle empty or invalid documents
        const posts = snapshot.docs.map((doc) => {
          try {
            return formatDoc(doc, userId);
          } catch (e) {
            console.error(
              "Error formatting document:",
              e,
              "Document data:",
              doc.data()
            );
            // Return a minimal valid post object instead of throwing
            return {
              id: doc.id,
              title: "Error: Could not load post",
              content: "",
              slug: doc.id,
              status: "draft",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              views: 0,
              authorId: userId,
            };
          }
        });

        console.log("Returning", posts.length, "formatted posts");
        return posts;
      } catch (error) {
        console.error("Error getting user posts:", error);
        // Return an empty array instead of throwing, which is more resilient
        // and will prevent the API from crashing
        return [];
      }
    },
    // Get all posts across all users
    getAll: async ({
      page = 1,
      limit: pageLimit = 10,
      status = "all",
      search = "",
      sort = "newest",
    }: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      sort?: string;
    }) => {
      // This requires a collection group query
      let postsQuery = query(collection(db, "posts"));

      // Filter by status
      if (status !== "all") {
        postsQuery = query(postsQuery, where("status", "==", status));
      }

      // Apply sorting
      if (sort === "oldest") {
        postsQuery = query(postsQuery, orderBy("updatedAt", "asc"));
      } else if (sort === "a-z") {
        postsQuery = query(postsQuery, orderBy("title", "asc"));
      } else if (sort === "z-a") {
        postsQuery = query(postsQuery, orderBy("title", "desc"));
      } else if (sort === "most-viewed") {
        postsQuery = query(postsQuery, orderBy("views", "desc"));
      } else {
        // Default: newest
        postsQuery = query(postsQuery, orderBy("updatedAt", "desc"));
      }

      const snapshot = await getDocs(postsQuery);
      let allPosts = snapshot.docs.map((doc) => {
        // Extract userId from the path
        const userId = doc.ref.path.split("/")[1];
        return formatDoc(doc, userId);
      });

      // Apply search filter in JS (Firestore doesn't support full text search)
      if (search) {
        const searchLower = search.toLowerCase();
        allPosts = allPosts.filter(
          (post) =>
            post?.title.toLowerCase().includes(searchLower) ||
            (post?.excerpt &&
              post.excerpt.toLowerCase().includes(searchLower)) ||
            (post?.tags &&
              post.tags.some((tag: string) =>
                tag.toLowerCase().includes(searchLower)
              ))
        );
      }

      // Calculate pagination
      const total = allPosts.length;
      const totalPages = Math.ceil(total / pageLimit);
      const startIndex = (page - 1) * pageLimit;
      const endIndex = startIndex + pageLimit;
      const paginatedPosts = allPosts.slice(startIndex, endIndex);

      return {
        posts: paginatedPosts,
        total,
        totalPages,
        currentPage: page,
      };
    },

    // Get a post by ID, requires knowing the user ID
    getById: async (userId: string, postId: string) => {
      const docRef = doc(db, `users/${userId}/posts`, postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      return formatDoc(docSnap, userId);
    },

    // Get all posts for discovery (from the discover collection)
    discover: async ({
      page = 1,
      limit: pageLimit = 10,
      status = "published", // Default to published for discovery
      search = "",
      sort = "newest",
    }: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      sort?: string;
    }) => {
      // Use the discover collection instead of posts
      const discoverRef = collection(db, "discover");
      let discoverQuery = query(discoverRef);

      // For discovery, we typically only want published posts
      if (status !== "all") {
        discoverQuery = query(discoverQuery, where("status", "==", status));
      }

      // Apply sorting
      if (sort === "oldest") {
        discoverQuery = query(discoverQuery, orderBy("updatedAt", "asc"));
      } else if (sort === "a-z") {
        discoverQuery = query(discoverQuery, orderBy("title", "asc"));
      } else if (sort === "z-a") {
        discoverQuery = query(discoverQuery, orderBy("title", "desc"));
      } else if (sort === "most-viewed") {
        discoverQuery = query(discoverQuery, orderBy("views", "desc"));
      } else {
        // Default: newest
        discoverQuery = query(discoverQuery, orderBy("updatedAt", "desc"));
      }

      const snapshot = await getDocs(discoverQuery);
      let allPosts = snapshot.docs.map((doc) => formatDoc(doc));

      // Apply search filter (client-side for flexibility)
      if (search) {
        const searchLower = search.toLowerCase();
        allPosts = allPosts.filter(
          (post) =>
            post?.title.toLowerCase().includes(searchLower) ||
            (post?.excerpt &&
              post.excerpt.toLowerCase().includes(searchLower)) ||
            (post?.tags &&
              post.tags.some((tag: string) =>
                tag.toLowerCase().includes(searchLower)
              ))
        );
      }

      // Handle pagination
      const total = allPosts.length;
      const totalPages = Math.ceil(total / pageLimit);
      const startIndex = (page - 1) * pageLimit;
      const endIndex = startIndex + pageLimit;
      const paginatedPosts = allPosts.slice(startIndex, endIndex);

      return {
        posts: paginatedPosts,
        total,
        totalPages,
        currentPage: page,
      };
    },

    // Get a post by ID from the discover collection
    getPublishedById: async (postId: string) => {
      const docRef = doc(db, "discover", postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      return formatDoc(docSnap);
    },

    // Find a post by ID without knowing the user ID
    // Used for permalinks
    findById: async (postId: string) => {
      // First try the discover collection (faster)
      const discoverPost = await firestore.posts.getPublishedById(postId);
      if (discoverPost) return discoverPost;

      // If not found, try the collection group (might be a draft)
      const postsQuery = query(
        collectionGroup(db, "posts"),
        where("__name__", "==", postId)
      );

      const snapshot = await getDocs(postsQuery);
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      const userId = doc.ref.path.split("/")[1];

      return formatDoc(doc, userId);
    },

    // Create a post for a specific user
    create: async (
      userId: string,
      data: {
        title: string;
        content?: string;
        excerpt?: string;
        status?: "published" | "draft";
        tags?: string[];
        authorId?: string;
      }
    ) => {
      try {
        if (!userId) {
          console.error("User ID is required to create a post");
          throw new Error("User ID is required");
        }

        if (!data) {
          console.error("Post data is required");
          throw new Error("Post data is required");
        }

        // Use optional chaining and defaults to prevent destructuring errors
        const {
          title,
          content = "",
          excerpt = "",
          status = "draft",
          tags = [],
        } = data || {};

        if (!title) {
          console.error("Post title is required");
          throw new Error("Post title is required");
        }

        // Generate a slug from the title
        const slug = title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-");

        // Create post data object
        const postData = {
          title,
          slug,
          content,
          excerpt,
          status,
          views: 0,
          tags,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          authorId: userId, // Always store the userId
          ...(status === "published" && { publishedAt: serverTimestamp() }),
        };

        console.log("Creating post for user:", userId, "with data:", {
          ...postData,
          createdAt: "timestamp",
          updatedAt: "timestamp",
        });

        // 1. Add to the user's posts subcollection
        const postsRef = collection(db, `users/${userId}/posts`);
        const docRef = await addDoc(postsRef, postData);
        const postId = docRef.id;

        console.log("Post created with ID:", postId);

        // 2. If published, also add to the discover collection
        if (status === "published") {
          // Create a preview version with limited content for discovery
          const previewData = {
            id: postId, // Store the original postId
            title,
            slug,
            excerpt,
            status,
            views: 0,
            tags,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            publishedAt: serverTimestamp(),
            authorId: userId, // Store the userId for attribution
            userId, // Also store userId explicitly for joins
          };

          // Set in the discover collection with the same ID
          await setDoc(doc(db, "discover", postId), previewData);
          console.log("Post added to discover collection");
        }

        // Get and return the created post
        const newPostSnap = await getDoc(docRef);
        if (!newPostSnap.exists()) {
          console.error("Post was created but could not be retrieved");
          throw new Error("Post creation failed");
        }

        const formattedPost = formatDoc(newPostSnap, userId);
        console.log("Returning formatted post:", formattedPost);
        return formattedPost;
      } catch (error) {
        console.error("Error creating post:", error);
        throw error;
      }
    },

    // Update a post
    update: async (
      userId: string,
      postId: string,
      data: {
        title?: string;
        content?: string;
        excerpt?: string;
        status?: "published" | "draft";
        tags?: string[];
      }
    ) => {
      try {
        const { title, content, excerpt, status, tags } = data;

        // 1. Check if the post exists in the user's subcollection
        const postRef = doc(db, `users/${userId}/posts`, postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          return null;
        }

        const existingPost = postSnap.data();

        // Generate a new slug if the title changed
        let slug;
        if (title && title !== existingPost.title) {
          slug = title
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "-");
        }

        // Prepare update data for the user's post
        const updateData: Record<string, any> = {
          updatedAt: serverTimestamp(),
        };

        if (title) updateData.title = title;
        if (slug) updateData.slug = slug;
        if (content !== undefined) updateData.content = content;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (status) updateData.status = status;
        if (tags) updateData.tags = tags;

        // Handle publishing status changes
        const wasPublished = existingPost.status === "published";
        const willBePublished = status === "published";

        // If status is changing to published and has never been published before
        if (willBePublished && !existingPost.publishedAt) {
          updateData.publishedAt = serverTimestamp();
        }

        // Start a batch write
        const batch = writeBatch(db);

        // 2. Update the user's post
        batch.update(postRef, updateData);

        // 3. Handle the discover collection
        const discoverPostRef = doc(db, "discover", postId);

        // If newly published, add to discover collection
        if (!wasPublished && willBePublished) {
          // Create a preview version for the discover collection
          const previewData = {
            id: postId,
            title: title || existingPost.title,
            slug: slug || existingPost.slug,
            excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
            status: "published",
            views: existingPost.views || 0,
            tags: tags || existingPost.tags || [],
            createdAt: existingPost.createdAt,
            updatedAt: serverTimestamp(),
            publishedAt: serverTimestamp(),
            authorId: userId,
            userId,
          };

          batch.set(discoverPostRef, previewData);
        }
        // If published and staying published, update discover collection
        else if (wasPublished && willBePublished) {
          const discoverUpdateData: Record<string, any> = {
            updatedAt: serverTimestamp(),
          };

          if (title) discoverUpdateData.title = title;
          if (slug) discoverUpdateData.slug = slug;
          if (excerpt !== undefined) discoverUpdateData.excerpt = excerpt;
          if (tags) discoverUpdateData.tags = tags;

          batch.update(discoverPostRef, discoverUpdateData);
        }
        // If unpublishing, remove from discover collection
        else if (wasPublished && !willBePublished) {
          batch.delete(discoverPostRef);
        }

        // Commit all the changes
        await batch.commit();

        // Return the updated post
        const updatedPostSnap = await getDoc(postRef);
        return formatDoc(updatedPostSnap, userId);
      } catch (error) {
        console.error("Error updating post:", error);
        throw error;
      }
    },

    // Update a post's status
    updateStatus: async (
      userId: string,
      postId: string,
      status: "published" | "draft"
    ) => {
      try {
        // A simplified version of the update function, focused on status changes
        const postRef = doc(db, `users/${userId}/posts`, postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          return null;
        }

        const existingPost = postSnap.data();

        // If status isn't changing, return early
        if (existingPost.status === status) {
          return formatDoc(postSnap, userId);
        }

        // Prepare update data
        const updateData: Record<string, any> = {
          status,
          updatedAt: serverTimestamp(),
        };

        // If status is changing to published and has never been published before
        if (status === "published" && !existingPost.publishedAt) {
          updateData.publishedAt = serverTimestamp();
        }

        // Start a batch write
        const batch = writeBatch(db);

        // Update the user's post
        batch.update(postRef, updateData);

        // Handle the discover collection
        const discoverPostRef = doc(db, "discover", postId);

        // If publishing, add to discover collection
        if (status === "published") {
          // Create a preview version
          const previewData = {
            id: postId,
            title: existingPost.title,
            slug: existingPost.slug,
            excerpt: existingPost.excerpt || "",
            status: "published",
            views: existingPost.views || 0,
            tags: existingPost.tags || [],
            createdAt: existingPost.createdAt,
            updatedAt: serverTimestamp(),
            publishedAt: updateData.publishedAt || existingPost.publishedAt,
            authorId: userId,
            userId,
          };

          batch.set(discoverPostRef, previewData);
        }
        // If unpublishing, remove from discover collection
        else {
          batch.delete(discoverPostRef);
        }

        // Commit all the changes
        await batch.commit();

        // Return the updated post
        const updatedPostSnap = await getDoc(postRef);
        return formatDoc(updatedPostSnap, userId);
      } catch (error) {
        console.error("Error updating post status:", error);
        throw error;
      }
    },

    // Delete a post
    delete: async (userId: string, postId: string) => {
      try {
        // Check if the post exists
        const postRef = doc(db, `users/${userId}/posts`, postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          return null;
        }

        // Format the post before deletion
        const deletedPost = formatDoc(postSnap, userId);

        // Start a batch write
        const batch = writeBatch(db);

        // Delete from the user's subcollection
        batch.delete(postRef);

        // Also try to delete from the discover collection
        // (it might not exist if it was never published)
        const discoverPostRef = doc(db, "discover", postId);
        const discoverPostSnap = await getDoc(discoverPostRef);

        if (discoverPostSnap.exists()) {
          batch.delete(discoverPostRef);
        }

        // Commit the batch
        await batch.commit();

        return deletedPost;
      } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
      }
    },

    // Increment post views (updates both copies)
    incrementViews: async (userId: string, postId: string) => {
      try {
        // Start a batch
        const batch = writeBatch(db);

        // Increment in the user's subcollection
        const postRef = doc(db, `users/${userId}/posts`, postId);
        batch.update(postRef, {
          views: increment(1),
        });

        // Try to increment in the discover collection
        const discoverPostRef = doc(db, "discover", postId);
        const discoverPostSnap = await getDoc(discoverPostRef);

        if (discoverPostSnap.exists()) {
          batch.update(discoverPostRef, {
            views: increment(1),
          });
        }

        await batch.commit();
      } catch (error) {
        console.error("Error incrementing post views:", error);
        throw error;
      }
    },
  },

  // Tags operations
  tags: {
    // Get all tags
    getAll: async () => {
      try {
        const tagsRef = collection(db, "tags");
        const snapshot = await getDocs(tagsRef);
        return snapshot.docs.map((doc) => formatDoc(doc));
      } catch (error) {
        console.error("Error getting tags:", error);
        throw error;
      }
    },

    // Get posts by tag
    getPostsByTag: async (tagName: string) => {
      try {
        // Query the discover collection
        const discoverRef = collection(db, "discover");
        const q = query(
          discoverRef,
          where("tags", "array-contains", tagName),
          where("status", "==", "published"),
          orderBy("updatedAt", "desc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => formatDoc(doc));
      } catch (error) {
        console.error("Error getting posts by tag:", error);
        throw error;
      }
    },
  },

  // Users operations
  users: {
    // Get a user by ID
    getById: async (id: string) => {
      const userRef = doc(db, "users", id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      return { id: userSnap.id, ...userSnap.data() };
    },

    // Get all users
    getAll: async () => {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map((doc) => formatDoc(doc));
    },

    // Get a user's posts
    getPosts: async (
      userId: string,
      { status = "all", sort = "newest" } = {}
    ) => {
      const postsRef = collection(db, `users/${userId}/posts`);
      let postsQuery = query(postsRef);

      // Filter by status
      if (status !== "all") {
        postsQuery = query(postsQuery, where("status", "==", status));
      }

      // Apply sorting
      if (sort === "newest") {
        postsQuery = query(postsQuery, orderBy("updatedAt", "desc"));
      } else if (sort === "oldest") {
        postsQuery = query(postsQuery, orderBy("updatedAt", "asc"));
      } else if (sort === "a-z") {
        postsQuery = query(postsQuery, orderBy("title", "asc"));
      } else if (sort === "z-a") {
        postsQuery = query(postsQuery, orderBy("title", "desc"));
      } else if (sort === "most-viewed") {
        postsQuery = query(postsQuery, orderBy("views", "desc"));
      }

      const snapshot = await getDocs(postsQuery);
      return snapshot.docs.map((doc) => formatDoc(doc, userId));
    },
  },
};

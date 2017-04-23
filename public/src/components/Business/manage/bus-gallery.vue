<template>
  <div class="bus-gallery-edit">

    <!-- Errors -->
    <div class="errors" v-if="errors.length>0">
      <div class="error" v-for="error in errors">
        <el-alert @close="errors.splice(error, 1)"
                  :title="error" class="error"
                  type="error" show-icon></el-alert>
      </div>
    </div>
    <div class="image-buttons">
      <button class="button is-primary" v-if="images.length > 0" @click="addDialogue = true">Add Image</button>
      <button class="button is-info" v-if="images.length > 0" @click="getGallery">Refresh</button>
    </div>
    <div class="columns is-multiline" v-if="images.length > 0">
      <div class="column is-4" v-for="image in images" :key="image._id">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img :src="'/uploads/' + image.path" alt="Image">
            </figure>
          </div>
          <div class="card-content" v-if="image.description">
           <p>
             {{ image.description }}
           </p>
          </div>
          <div class="card-footer">
            <p class="card-footer-item">
              <a href="#" @click.prevent="showDeleteDialog(image._id)" class="is-danger">Delete</a>
            </p>
            <p class="card-footer-item">
              <a href="#" @click.prevent="showEditDialog(image)" class="is-info">Edit</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No data found. -->
    <div class="no-data hero" v-show="images.length === 0">
      <div class="hero-body has-text-centered">
        <el-icon name="circle-close" class="confirmation-icon icon-fail"></el-icon>
        <p class="title is-2">No Images Found.</p>
        <a class="button is-info" @click.prevent="addDialogue = true">Add New One?</a>
      </div>
    </div>

    <!-- Image Add -->
    <el-dialog title="Add Image" v-model="addDialogue">

      <!-- Add Image Errors -->
      <div class="errors" v-if="addErrors.length>0">
        <div class="error" v-for="error in addErrors">
          <el-alert @close="addErrors.splice(error, 1)"
                    :title="error" class="error"
                    type="error" show-icon></el-alert>
        </div>
      </div>

      <!-- Add Image Form -->
      <form method="post" @submit.prevent="submitAddForm" enctype="multipart/form-data">
        <div class="field">
          <label for="description" class="label">Description</label>
          <p class="control">
            <input id="description" class="input" type="text" v-model="addForm.description"/>
          </p>
        </div>

        <div class="field">
          <label class="label">Image</label>
          <p class="control has-icon has-icon-right">
            <input type="file" name="image" class="form-control"
                   accept="image/*" @change="fileChanged">
          </p>
        </div>
        <p class="control">
          <el-button @click.prevent="submitAddForm" type="primary" size="large">Add</el-button>
        </p>
      </form>
    </el-dialog>

    <!-- Image Edit-->
    <el-dialog title="Edit Image" v-model="editDialogue">
      <el-form :model="editForm">
        <el-form-item label="Image Description">
          <el-input v-model="editForm.description" :value="imageToEdit.description"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogue = false">Cancel</el-button>
        <el-button type="primary" @click="editImage">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- Image Delete -->
    <el-dialog title="Delete Image" v-model="deleteDialogue">
      <span>This cannot be undone. Delete this image?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogue = false">Cancel</el-button>
        <el-button type="danger" @click="deleteImage">Confirm</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
 /**
  * This component displays the business gallery.
  */
  import axios from 'axios';
  import { Business } from '../../../services/EndPoints';
  import businessAuth from '../../../services/auth/businessAuth';
  import Form from '../../../services/Form';
  import JWTCheck from '../../../services/JWTErrors';

  export default {
    /**
     * Data used by this component.
     * images: Array of Business Images.
     * errors: Errors received from server.
     * addErrors: Errors received when adding an image.
     * loader: Loading Object to load.
     * addDialogue: true to display dialog, false otherwise.
     * deleteDialogue: true to display dialog, false otherwise.
     * editDialogue: true to display dialog, false otherwise.
     * imageToDelete: Image ID to delete.
     * imageToEdit: Image ID to Edit.
     * editForm: Data to edit image with.
     * addForm: Data to add image with.
     */
    data() {
      return {
        images: [],
        errors: [],
        addErrors: [],
        loader: '',
        addDialogue: false,
        deleteDialogue: false,
        editDialogue: false,
        imageToDelete: '',
        imageToEdit: '',
        editForm: {
          description: '',
        },
        addForm: new Form({
          description: '',
          path: '',
        }),
      };
    },
    /**
     * Ran when component is mounted on DOM.
     * Gets the Business Gallery.
     */
    mounted() {
      this.getGallery();
    },
    /**
     * All Methods used by this component.
     */
    methods: {
      /**
       * Creates a new loader.
       */
      setupLoader() {
        this.loader = this.$loading({
          fullscreen: true,
        });
      },
      /**
       * Get Images in current business gallery.
       */
      getGallery() {
        this.setupLoader();
        axios.get(Business().viewGallery, {
          headers: {
            Authorization: businessAuth.getJWTtoken(),
          },
        })
            .then((res) => {
              this.images = res.data.results;
              this.errors = [];
              this.loader.close();
            })
            .catch((err) => {
              this.loader.close();
              if(err.response && JWTCheck(err.response.data.errors)) {
                businessAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  text: 'Your sessions has expired. Please login.',
                  position: 'bottom',
                  type: 'danger'
                });
              } else {
                this.errors = err.response.data.errors;
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }
            });
      },
      /**
       * Add new Image form submit.
       */
      submitAddForm() {
        if (this.addForm.path) {
          if (this.isImage(this.addForm.path)) {
            const data = new FormData();
            data.append('path', this.addForm.path);
            data.append('description', this.addForm.description);
            this.addErrors = [];
            this.addForm.errors.clear();
            this.addImage(data);
          } else {
            this.addErrors = ['You can only submit Images.'];
          }
        } else {
          this.addErrors = ['Image is required.'];
        }
      },
      /**
       * Add Image to business gallery.
       */
      addImage(data) {
        this.setupLoader();
        axios.post(Business().addImage, data, {
          headers: {
            Authorization: businessAuth.getJWTtoken(),
          },
        })
            .then(() => {
              this.addForm.reset();
              this.addDialogue = false;
              this.getGallery();
              this.$toast.open({
                message: 'Image Added.',
                position: 'bottom',
                type: 'is-success',
              });
              this.loader.close();
            })
            .catch((err) => {
              this.loader.close();
              if(err.response && JWTCheck(err.response.data.errors)) {
                businessAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  text: 'Your sessions has expired. Please login.',
                  position: 'bottom',
                  type: 'danger'
                });
              } else {
                this.addErrors = err.response.data.errors;
              }
            });
      },
      /**
       * Show the edit image dialog.
       */
      showDeleteDialog(imageID) {
        this.deleteDialogue = true;
        this.imageToDelete = imageID;
      },
      /**
       * Show the delete image dialog.
       */
      showEditDialog(image) {
        this.editDialogue = true;
        this.imageToEdit = image._id;
        this.editForm.description = image.description;
      },
      /**
       * Edit image with {imageID}.
       */
      editImage() {
        this.setupLoader();
        axios.post(Business().editImage(this.imageToEdit), this.editForm, {
          headers: {
            Authorization: businessAuth.getJWTtoken(),
          },
        })
            .then(() => {
              this.loader.close();
              this.editForm.description = '';
              this.$toast.open({
                message: 'Image Edited.',
                position: 'bottom',
                type: 'is-success',
              });
              this.getGallery();
              this.editDialogue = false;
            })
            .catch((err) => {
              this.loader.close();
              if(err.response && JWTCheck(err.response.data.errors)) {
                businessAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  text: 'Your sessions has expired. Please login.',
                  position: 'bottom',
                  type: 'danger'
                });
              } else {
                this.editDialogue = false;
                this.errors = err.response.data.errors;
              }
            });
      },
      /**
       * Delete image with {imageID}.
       */
      deleteImage() {
        this.setupLoader();
        axios.post(Business().deleteImage(this.imageToDelete), {}, {
          headers: {
            Authorization: businessAuth.getJWTtoken(),
          },
        })
            .then(() => {
              this.deleteDialogue = false;
              this.$toast.open({
                message: 'Image Deleted.',
                position: 'bottom',
                type: 'is-success',
              });
              this.getGallery();
            })
            .catch((err) => {
              this.loader.close();
              if(err.response && JWTCheck(err.response.data.errors)) {
                businessAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  text: 'Your sessions has expired. Please login.',
                  position: 'bottom',
                  type: 'danger'
                });
              } else {
                this.errors = err.response.data.errors;
              }
            });
      },
      /**
       * File upload handler.
       */
      fileChanged(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length > 0) {
          this.addForm.path = files[0];
          // the path is changed to the possibly illegal file for consistency with submission
          if (this.isImage(files[0])) {
            this.errors = [];
          } else {
            this.addErrors = ['Only Images are allowed.'];
          }
        }
      },
      /**
       * Returns true If the type of the file is image, false otherwise.
       */
      isImage(file) {
        return file.type.split('/')[0] === 'image';
      },
    },
  };
</script>

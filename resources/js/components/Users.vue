<template>
    <div class="container">
        <div class="row mt-3">
            <div class="col-md-12" v-if="$gate.isAdminOrAuthor()">
                <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Users List</h3>

                    <div class="card-tools">
                    <button class="btn btn-success" @click.prevent="openModal('New')">Add New <i class="fas fa-user-plus fa-fw"></i></button>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                    <table class="table table-hover">
                    <tbody><tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Registered At</th>
                        <th>Modify</th>
                    </tr>
                    <tr v-for="user in users.data" :key="user.key"> 
                        <td>{{user.id}}</td>
                        <td>{{user.name}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.type | capitalize}}</td>
                        <td>{{user.created_at | myDate}}</td>
                        <td>
                            <a href="#" @click.prevent="openModal(user)"><i class="fa fa-edit orange"></i></a>
                            <span class="mx-2">|</span>
                            <a href="#" @click.prevent="deleteUser(user.id)"><i class="fa fa-trash red"></i></a>
                        </td>
                    </tr>
                    </tbody></table>
                </div>
                <!-- /.card-body -->
                <div class="card-footer">
                    <pagination :data="users" @pagination-change-page="getResults"></pagination>
                    <!-- <pagination :data="users">
                        <span slot="prev-nav">&lt; Previous</span>
                        <span slot="next-nav">Next &gt;</span>
                    </pagination> -->
                </div>
                </div>
                <!-- /.card -->
            <button @click.prevent="printUser" class="btn btn-info">Print</button>
            </div>
            <div v-else>
                <not-found></not-found>
            </div>
          
        </div>

        <!-- Modal -->
            <div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title indigo" id="addNewLabel">{{ editMode ? 'Edit User' : 'Add New User'}}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form @submit.prevent="editMode ? updateUser() :createUser() ">
                            <div class="modal-body">
                                    <div class="form-group row">
                                        <label for="name" class="col-sm-2 col-form-label cyan">Name</label>
                                        <div class="col-sm-10">
                                            <input v-model="form.name" id="name" type="text" name="name" placeholder="Enter Name"
                                            class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                        <has-error :form="form" field="name"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="email" class="col-sm-2 col-form-label cyan">Email</label>
                                        <div class="col-sm-10">
                                            <input v-model="form.email" id="email" type="email" name="email" placeholder="Enter Email"
                                            class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                            <has-error :form="form" field="email"></has-error>
                                        </div>
                                    </div>                    
                                    <div class="form-group row">
                                        <label for="type" class="col-sm-2 col-form-label cyan">Type</label>
                                        <div class="col-sm-10">
                                            <select name="type" id="type" v-model="form.type" class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                                                <option value="">Select User Role</option>
                                                <option value="admin">Admin</option>
                                                <option value="user">Standard User</option>
                                                <option value="author">Author</option>
                                            </select>
                                            <has-error :form="form" field="type"></has-error>
                                        </div>
                                    </div>                    
                                    <div class="form-group row">
                                        <label for="bio" class="col-sm-2 col-form-label cyan">Biography</label>
                                        <div class="col-sm-10">
                                            <textarea name="bio" id="bio" v-model="form.bio" class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }" placeholder="Short Bio for User (Optional)"></textarea>
                                            <has-error :form="form" field="bio"></has-error>
                                        </div>
                                    </div>                    
                                    <div class="form-group row">
                                        <label for="photo" class="col-sm-2 col-form-label cyan">Biography</label>
                                        <div class="col-sm-10">
                                            <input type="file" name="photo" id="photo" class="form-control" :class="{ 'is-invalid': form.errors.has('photo') }">
                                            <has-error :form="form" field="photo"></has-error>
                                        </div>
                                    </div>                    
                                    <div class="form-group row">
                                        <label for="password" class="col-sm-2 col-form-label cyan">Password</label>
                                        <div class="col-sm-10">
                                            <input v-model="form.password" id="password" type="password" name="password" placeholder="Enter Password"
                                            class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                        <has-error :form="form" field="password"></has-error>
                                        </div>
                                    </div>
                            </div>
                            <div class="modal-footer">
                                <button @click="cancelCreate()" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-success">{{ editMode ? 'Update' : 'Create'}}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                users: {},
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: '',
                }),
                editMode: false
            }
        },
        methods: {
            printUser(){
                window.print();
            },
            openModal(param){
                if(param == 'New'){
                    this.editMode = false;
                    this.form.reset();
                    this.form.clear();
                    $('#userModal').modal('show')
                }else{
                    this.editMode = true;
                    this.form.reset();
                    this.form.clear();
                    $('#userModal').modal('show');
                    this.userUpdate(param);
                }
            },
            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
            },
            loadUsers(){
                if(this.$gate.isAdminOrAuthor()){
                    axios.get('api/user')
                    .then(({ data }) => { this.users = data })
                }
            },
            userUpdate(user){ 
                this.editMode = true;  
                this.form.fill(user);
            },
            updateUser(){  
                this.$Progress.start() 
                this.editMode = true;  
                console.log("Update User")
                this.form.put('api/user/' + this.form.id)
                .then( (response) => {
                    $('#userModal').modal('hide');
                    Swal.fire(
                        'User Updated!',
                        'Your file has been Updated.',
                        'success'
                    )
                    this.loadUsers();
                    Toast.fire({
                        icon: 'success',
                        title: 'User Updated in successfully'
                    })
                    this.$Progress.finish()
                    console.log(response.data)
                })
                .catch( () => {
                    this.$Progress.fail()
                })
            },
            createUser(){
                this.editMode = false
                console.log("Creat User")
                this.$Progress.start()
                this.form.post('/api/user')
                .then(({ data }) => { 
                    Fire.$emit("ReloadTable")
                    $('#userModal').modal('hide');
                    // this.loadUsers();
                    // console.log(data) 
                    Toast.fire({
                        icon: 'success',
                        title: 'User Created in successfully'
                    })
                    this.$Progress.finish()
                })
                .catch( () => {
                    this.$Progress.fail()
                })
            },
            cancelCreate(){
                this.form.reset();
                this.form.clear();
                this.editMode = false
            },
            deleteUser(id){
                Swal.fire({
                    title: 'Are you sure?',
                    // text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Delete'
                    }).then((result) => {
                        if (result.value) {
                            this.$Progress.start()
                            axios.delete('api/user/' + id)
                            .then( () => {
                                this.$Progress.finish()
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Deleted!',
                                    // text: 'Your file has been deleted.',
                                })
                                this.loadUsers();
                            })
                            .catch( () => {
                                this.$Progress.fail()
                                Swal.fire({
                                    icon: 'error',
                                    title: 'No Permission to Delete User',
                                    // text: 'No Permission'
                                })
                            })
                            
                        }
                    })
            }
        },
        mounted(){

        },
        created() {
            Fire.$on('searching', () => {
                let query = this.$parent.search;
                axios.get('api/findUser?s=' + query)
                    .then( (data) => {
                        this.users = data.data
                        this.$Progress.finish()
                    })
                    .catch( () => {
                        this.$Progress.fail()
                    })
            })
            this.loadUsers();
            Fire.$on('ReloadTable', () => {
                this.loadUsers();
            })
        }
    }
</script>

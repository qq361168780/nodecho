<template>
    <div class="post">
        <i-content
            v-if="post"
            :title="post.title"
            :content="post.content" />
        <template v-else>
            <div class="message" v-if="message">{{ message }}</div>
            <div class="auth">
                <auth v-if="authType" :type="authType" v-on:submit="submit" />
            </div>
        </template>
    </div>
</template>

<script>
import Auth from './Auth';
import Content from './Content';
import Message from 'iview/src/components/message';

export default {
    name: 'hello',

    components: { Auth, iContent: Content },

    data () {
        return {
            post: null,
            auth: {
                private: false,
                passwordRequired: false,
                password: null
            },
            message: null
        };
    },

    computed: {
        authType: function () {
            return this.auth.private ? 'account' : this.auth.passwordRequired ? 'password' : null;
        }
    },

    watch: {
        '$route': {
            deep: true,
            handler (to, from) {
                if (to.name !== 'Post') return;
                this.fetch();
            }
        }
    },

    methods: {
        fetch () {
            this.post = this.message = null;
            this.$api.posts
                .get({
                    id: this.$route.params.id || '',
                    password: this.auth.password
                })
                .then(res => {
                    this.post = res.body;
                })
                .catch(err => {
                    this.message = err.body.error;
                    if (err.status !== 401) {
                        Message.error(err.body.error);
                        return;
                    }
                    if (err.body.passwordRequired) {
                        this.auth.passwordRequired = true;
                    } else {
                        this.auth.private = true;
                    }
                });
        },
        submit (password) {
            this.auth.password = password;
            this.fetch();
        }
    },

    mounted () {
        this.fetch();
    }
};
</script>

<style lang="less" scoped>
.auth {
    max-width: 400px;
    padding: 1rem;
    margin: 0 auto;
}

.message {
    padding: 1rem;
    text-align: center;
    font-size: 1.2rem;
}

.post {
    overflow: hidden;
}
</style>
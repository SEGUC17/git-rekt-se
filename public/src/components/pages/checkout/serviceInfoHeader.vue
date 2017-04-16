<template>
    <section class="checkout-top hero is-bold">
        <div class="hero-body">
            <div class="container service-info-header">
                <h1 class="white title is-2">{{ service.name }}</h1>
                <p class="white subtitle">{{ service.businessName}}</p>
                <p class="white subtitle">
                    {{ service.shortDescription}}
                </p>
                <el-rate v-model="service.rating" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled></el-rate>
            </div>
        </div>
    </section>
</template>

<script>
  export default{
    props: ['service'],
  };
</script>

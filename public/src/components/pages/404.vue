<template>
    <div class="not-found">
        <div class="hero">
            <div class="hero-body has-text-centered">
               <div class="container">
                   <div class="title not-found">404</div>
                   <div class="subtitle not-found-sub">This is just embarrassing; the page does not exist...</div>
                   <hr>
                   <p class="subtitle return-home-sub">
                       Let's return to the <router-link class="return-home" to="/">home page</router-link>
                   </p>
               </div>
            </div>
        </div>
    </div>
</template>

<style>
    .not-found {
        font-size: 3.5em;
    }

    .not-found-sub {
        font-size: 0.6em;
    }

    .return-home-sub {
        font-size: 0.4em;
    }
    .return-home {
        font-weight: bold;
    }
    @media screen and (max-width: 999px) {
        .not-found {
            font-size: 3em;
        }
    }
</style>

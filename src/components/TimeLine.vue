<template>
  <div class="item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="details">
      <h3>
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}
.details {
  flex: 1;
  margin-left: 1rem;
}
i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;
  color: black;
}
h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: black;
}
@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.5rem;
  }
  i {
    top: calc(50% - 2.5rem);
    left: -2.6rem;
    position: absolute;
    border: 1px solid grey;
    background: grey;
    border-radius: 0.8rem;
    width: 5rem;
    height: 5rem;
  }
  .item:before {
    content: ' ';
    border-left: 1px solid grey;
    position: absolute;
    left: 0;
    bottom: calc(50% + 2.5rem);
    height: calc(50% - 2.5rem);
  }
  .item:after {
    content: ' ';
    border-left: 1px solid grey;
    position: absolute;
    left: 0;
    top: calc(50% + 2.5rem);
    height: calc(50% - 2.5rem);
  }
  .item:first-of-type:before {
    display: none;
  }
  .item:last-of-type:after {
    display: none;
  }
}
</style>
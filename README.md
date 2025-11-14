# Waterfall Component

A flexible and performant waterfall layout component for WeChat Mini Programs, featuring automatic item distribution, dynamic height calculation, and customizable item rendering.

https://github.com/user-attachments/assets/1d153a52-b506-4e28-a2ac-01c6c5256a1e

## Features

- 🎨 **Two-column Layout**: Automatically distributes items into two columns for optimal visual balance
- 📐 **Dynamic Height Calculation**: Uses `wx.getImageInfo()` to get actual image dimensions before rendering
- 🚀 **Performance Optimized**: Prevents layout flickering by calculating heights upfront
- 🎯 **Flexible Rendering**: Supports both abstract nodes (slots) and template-based item customization
- 📱 **Responsive Design**: Full-width layout that adapts to different screen sizes
- 🔧 **Customizable Spacing**: Configurable column and row gaps

## Installation

1. Copy the `waterfall` and `waterfall-item` components to your project:
   ```
   miniprogram/
   ├── components/
   │   ├── waterfall/
   │   └── waterfall-item/
   ├── behaviors/
   │   ├── waterfall-behavior.ts
   │   └── waterfall-item-behavior.ts
   └── templates/
       └── waterfall/
           └── default-item.wxml
   ```

2. Register the components in your page's `index.json`:
   ```json
   {
     "usingComponents": {
       "waterfall": "/components/waterfall/waterfall",
       "waterfall-item": "/components/waterfall-item/waterfall-item"
     }
   }
   ```

## Usage

### Basic Usage

```xml
<waterfall 
  list="{{waterfallList}}" 
  column-gap="{{20}}"
  row-gap="{{20}}"
  bind:itemtap="onWaterfallItemTap"
/>
```

### Method 1: Using Abstract Nodes (Slots)

This method provides maximum flexibility by allowing you to customize the item component directly in the template.

```xml
<waterfall 
  list="{{waterfallList}}" 
  column-gap="{{20}}"
  row-gap="{{20}}"
  use-slot="{{true}}"
  bind:itemtap="onWaterfallItemTap"
>
  <waterfall-item slot="waterfall-item-generic" />
</waterfall>
```

**Advantages:**
- More flexible for dynamic customization
- Better for scenarios requiring different item components

### Method 2: Using Templates

This method uses predefined templates for item rendering.

```xml
<!-- Import template in your page -->
<import src="../../templates/waterfall/index-item.wxml" />

<waterfall 
  list="{{waterfallList}}" 
  column-gap="{{20}}"
  row-gap="{{20}}"
  item-template="waterfallItem"
  bind:itemtap="onWaterfallItemTap"
/>
```

**Advantages:**
- Better for unified management and reuse
- Cleaner template structure

## API Reference

### Waterfall Component Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `list` | `Array` | `[]` | Data array for waterfall items. Each item should have at least an `id` and `image` property. |
| `columnGap` | `Number` | `20` | Gap between left and right columns (in rpx) |
| `rowGap` | `Number` | `20` | Gap between items vertically (in rpx) |
| `itemTemplate` | `String` | `''` | Template name for custom item rendering (used when `useSlot` is `false`) |
| `useSlot` | `Boolean` | `false` | Whether to use abstract nodes (slots) for item rendering |

### Waterfall Component Events

| Event Name | Description | Event Detail |
|------------|-------------|--------------|
| `itemtap` | Triggered when an item is tapped | `{ item: Object }` - The tapped item data |

### Data Structure

Each item in the `list` array should have the following structure:

```typescript
{
  id: number | string,        // Unique identifier (required)
  image: string,               // Image URL (required)
  title?: string,             // Optional title
  // ... other custom properties
}
```

The component will automatically add the following internal properties:

- `_imageKey`: Unique key for the image
- `_estimatedHeight`: Estimated height based on image dimensions
- `_imageHeight`: Calculated image height
- `_itemWidth`: Calculated item width
- `_actualWidth`: Original image width
- `_actualHeight`: Original image height

## Example

### Page Configuration (`index.json`)

```json
{
  "navigationBarTitleText": "Waterfall Demo",
  "usingComponents": {
    "waterfall": "/components/waterfall/waterfall",
    "waterfall-item": "/components/waterfall-item/waterfall-item"
  }
}
```

### Page Template (`index.wxml`)

```xml
<view class="container">
  <waterfall 
    list="{{waterfallList}}" 
    column-gap="{{20}}"
    row-gap="{{20}}"
    bind:itemtap="onWaterfallItemTap"
  />
</view>
```

### Page Logic (`index.ts`)

```typescript
Page({
  data: {
    waterfallList: [
      {
        id: 1,
        image: 'https://example.com/image1.jpg',
        title: 'Beautiful Landscape'
      },
      {
        id: 2,
        image: 'https://example.com/image2.jpg',
        title: 'Mountain View'
      },
      // ... more items
    ]
  },
  
  onWaterfallItemTap(e: any) {
    const { item } = e.detail
    console.log('Tapped item:', item)
    wx.showToast({
      title: item.title || 'Item tapped',
      icon: 'none'
    })
  }
})
```

## How It Works

1. **Image Dimension Detection**: When the `list` property changes, the component uses `wx.getImageInfo()` to fetch actual image dimensions for all images in parallel.

2. **Height Estimation**: Based on the actual image dimensions and the calculated item width, the component estimates the height of each item.

3. **Smart Distribution**: Items are distributed between left and right columns based on the current height of each column, ensuring a balanced layout.

4. **Dynamic Measurement**: After rendering, each `waterfall-item` component measures its actual height and reports it back to the parent. This information is stored but doesn't trigger re-layout to prevent flickering.

## Customization

### Custom Item Template

You can create custom templates for different item styles:

```xml
<!-- templates/waterfall/custom-item.wxml -->
<template name="customItem">
  <view class="custom-waterfall-item">
    <image 
      src="{{item.image}}" 
      mode="widthFix"
      class="item-image"
    />
    <view class="item-content">
      <text class="item-title">{{item.title}}</text>
      <text class="item-description">{{item.description}}</text>
    </view>
  </view>
</template>
```

Then use it in your page:

```xml
<import src="../../templates/waterfall/custom-item.wxml" />

<waterfall 
  list="{{waterfallList}}" 
  item-template="customItem"
/>
```

## Notes

- **Image Loading**: The component handles image loading automatically. Images are loaded asynchronously, and the layout is calculated before rendering to prevent container stretching.

- **Performance**: The component uses `Promise.all()` to fetch image information in parallel, ensuring fast initialization even with many items.

- **Height Calculation**: Initial layout is based on image dimensions. Actual container heights are measured after rendering but don't trigger re-layout to maintain smooth user experience.

- **Full-Width Layout**: The component uses full-screen width with minimal padding (4rpx gap between columns) for maximum content display.

## Browser Support

- WeChat Mini Program (基础库 2.0.0+)
- Requires `wx.getImageInfo()` API support
- Requires `wx.getWindowInfo()` API support (基础库 2.20.0+)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


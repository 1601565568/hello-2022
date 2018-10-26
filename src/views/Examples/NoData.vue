<template>
  <div>
    <p>暂无数据使用说明：</p>
    <p>可通过配置size或height来控制大小：size="sm"（高300px），size="md"（高500px），size="lg"（高700px），height="自定义高度"（不需要添加px）<span class="text-warning">默认为size="sm"</span></p>
    <p>可通过配置icon来替换特殊场景的无数据图标：icon="暂无数据的图标类名"，<span class="text-warning">默认为icon="zanwushuju"</span></p>
    <p>默认： 高300px</p>
    <ns-no-data>{{$t('prompt.noData')}}</ns-no-data>
    <p>高度自定义：height="200"</p>
    <ns-no-data height="200">{{$t('prompt.noData')}}</ns-no-data>
    <p>图标、文案自定义 icon="update"</p>
    <ns-no-data icon="update">页面飞了~</ns-no-data>
    <p>size="sm" 高300px</p>
    <ns-no-data size="sm">{{$t('prompt.noData')}}</ns-no-data>
    <p>size="md"  高500px</p>
    <ns-no-data size="md">{{$t('prompt.noData')}}</ns-no-data>
    <p>size="lg"  高700px</p>
    <ns-no-data size="lg">{{$t('prompt.noData')}}</ns-no-data>
    <p>size="full" 铺满父容器高度</p>
    <ns-no-data size="full">{{$t('prompt.noData')}}</ns-no-data>
  </div>
</template>

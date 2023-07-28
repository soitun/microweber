<div>

Edit post

    <form wire:submit.prevent="submit" >

        <div class="d-flex align-items-center justify-content-between">

            <x-microweber-ui::button-animation type="submit">@lang('Save')</x-microweber-ui::button-animation>
        </div>

        @if (isset($editorSettings['schema']))
            @include('content::admin.content.livewire.form-builder.schema-render')
        @endif


        <div class="d-flex align-items-center justify-content-between">
         
            <x-microweber-ui::button-animation type="submit">@lang('Save')</x-microweber-ui::button-animation>
        </div>
    </form>

</div>
let Program = undefined;
let Preview = undefined;

function getProgram() {
   return Program;
}

function getPreview() {
   return Preview;
}

function getProgPrev() {
   return {
      program: getProgram(),
      preview: getPreview()
   }
}

function storeProgram(program) {
   Program = program;
}

function storePreview(preview) {
   Preview = preview;
}

function storeProgPrev(program, preview) {
   storeProgram(program);
   storePreview(preview);
}

module.exports = {
   getProgram,
   getPreview,
   getProgPrev,
   storeProgram,
   storePreview,
   storeProgPrev
}
export const random = {
  color: function () {
    return 'hsl(' + Math.random() * 360 + ', 100%, 95%)';
  },
  deepColor: function ({ c, n }: { c?: string, n?: number } = {}) {
    // c is the color string to be modified (which is result of random.color())
    const p = `${n ? n : 60}%`;
    return c ? c.replace('95%', p) : 'hsl(' + Math.random() * 360 + `, 100%, ${p})`;
  }
}